/**
 * Prediction Service Layer
 * Interfaces between React UI and the Python ML Inference API (FastAPI)
 * 
 * STRICT ACADEMIC INTEGRITY DIRECTIVE:
 * Does NOT generate fake probabilities, fake SHAP values, or simulated accuracy.
 * Does NOT create a localStorage-based fake prediction database.
 * Real predictions require an active model pipeline running in Python with scikit-learn / XGBoost / SHAP.
 * If backend is unavailable, returns a clean "Backend unavailable" state.
 */

import { CampaignInput, PredictionRecord } from '../types';
import { apiClient } from './apiClient';

export const predictionService = {
  /**
   * Dispatches campaign input to the ML inference endpoint
   * If backend is not connected, returns backend unavailable state with zero fake data generation.
   */
  async predictCampaign(campaign: CampaignInput): Promise<{
    success: boolean;
    id: string | null;
    message: string;
    record: PredictionRecord | null;
    isModelConnected: boolean;
  }> {
    // Check if real Python ML backend is reachable
    const health = await apiClient.checkHealth();

    if (health.connected) {
      try {
        const response = await fetch(`${apiClient.getBaseUrl()}/predictions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(campaign),
        });
        if (response.ok) {
          const mlResult = await response.json();
          // Real ML output returned from FastAPI
          const record: PredictionRecord = {
            id: mlResult.id || `PRED-${Date.now().toString().slice(-6)}`,
            campaign,
            createdAt: mlResult.createdAt || new Date().toISOString(),
            status: 'completed',
            successProbability: mlResult.successProbability,
            predictedFunding: mlResult.predictedFunding,
            confidenceInterval: mlResult.confidenceInterval || null,
            modelVersion: mlResult.modelVersion || 'v1.0-production',
            shapFactors: mlResult.shapFactors || null,
            positiveFactors: mlResult.positiveFactors || null,
            riskFactors: mlResult.riskFactors || null,
            recommendations: mlResult.recommendations || null,
          };
          return {
            success: true,
            id: record.id,
            message: 'Inference completed by Python ML pipeline.',
            record,
            isModelConnected: true,
          };
        }
        return {
          success: false,
          id: null,
          message: `Prediction endpoint returned error status ${response.status}.`,
          record: null,
          isModelConnected: true,
        };
      } catch (err: any) {
        return {
          success: false,
          id: null,
          message: err?.message || 'Failed to reach prediction endpoint.',
          record: null,
          isModelConnected: false,
        };
      }
    }

    // Backend unavailable (Stage 1 expected state):
    // Do NOT generate fake records or fake probabilities.
    return {
      success: false,
      id: null,
      message: 'Backend unavailable. The FastAPI prediction service and ML model pipeline are not connected yet.',
      record: null,
      isModelConnected: false,
    };
  },

  /**
   * Retrieves single prediction record by ID from backend
   */
  async getPredictionById(id: string): Promise<PredictionRecord | null> {
    const health = await apiClient.checkHealth();
    if (!health.connected) {
      return null;
    }

    try {
      const response = await fetch(`${apiClient.getBaseUrl()}/predictions/${id}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Retrieves historical prediction records with optional filters from backend
   */
  async getPredictionHistory(filters?: {
    search?: string;
    category?: string;
    status?: string;
  }): Promise<PredictionRecord[]> {
    const health = await apiClient.checkHealth();
    if (!health.connected) {
      // Backend not connected: no fake records returned
      return [];
    }

    try {
      const queryParams = new URLSearchParams();
      if (filters?.search) queryParams.set('search', filters.search);
      if (filters?.category && filters?.category !== 'ALL') queryParams.set('category', filters.category);
      if (filters?.status && filters?.status !== 'ALL') queryParams.set('status', filters.status);

      const url = `${apiClient.getBaseUrl()}/predictions?${queryParams.toString()}`;
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch {
      return [];
    }
  },
};
