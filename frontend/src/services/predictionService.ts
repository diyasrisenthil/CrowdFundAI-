/**
 * Prediction Service Layer
 * Interfaces between React UI and the Python ML Inference API (FastAPI)
 */

import { CampaignInput, PredictionRecord, ShapFactor } from '../types';
import { apiClient } from './apiClient';

const STORAGE_KEY = 'crowdfundai_predictions';

function getStoredRecords(): PredictionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecordToStorage(record: PredictionRecord) {
  try {
    const records = getStoredRecords();
    const updated = [record, ...records.filter((r) => r.id !== record.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 50)));
  } catch (e) {
    console.error('Failed to save prediction record to localStorage:', e);
  }
}

export const predictionService = {
  /**
   * Dispatches campaign input to the FastAPI ML backend endpoint (/explain)
   * Populates prediction probability and real SHAP feature attributions.
   */
  async predictCampaign(campaign: CampaignInput): Promise<{
    success: boolean;
    id: string | null;
    message: string;
    record: PredictionRecord | null;
    isModelConnected: boolean;
  }> {
    const health = await apiClient.checkHealth();

    if (!health.connected) {
      return {
        success: false,
        id: null,
        message: 'Backend unavailable. The FastAPI service at http://localhost:8000 is not running.',
        record: null,
        isModelConnected: false,
      };
    }

    try {
      const payload = {
        title: campaign.campaignName,
        campaignName: campaign.campaignName,
        category: campaign.category,
        subCategory: campaign.subCategory || campaign.category,
        goalAmount: Number(campaign.fundingGoal),
        fundingGoal: Number(campaign.fundingGoal),
        durationDays: Number(campaign.campaignDuration),
        campaignDuration: Number(campaign.campaignDuration),
        currency: campaign.currency || 'USD',
        country: campaign.country || 'US',
        launched_month: campaign.launchMonth ? Number(campaign.launchMonth) : 10,
        launched_hour: campaign.launchHour ? Number(campaign.launchHour) : 14,
      };

      console.log("CROWDFUNDAI REQUEST PAYLOAD:", payload);

      // Call primary /predict endpoint
      const predictResponse = await fetch(`${apiClient.getBaseUrl()}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!predictResponse.ok) {
        const errorData = await predictResponse.json().catch(() => ({}));
        return {
          success: false,
          id: null,
          message: errorData.detail || `Backend returned HTTP status ${predictResponse.status}.`,
          record: null,
          isModelConnected: true,
        };
      }

      const predictResult = await predictResponse.json();
      console.log("CROWDFUNDAI API RESPONSE:", predictResult);


      // Call /explain for SHAP attributions
      let mlResult = predictResult;
      try {
        const explainResponse = await fetch(`${apiClient.getBaseUrl()}/explain`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (explainResponse.ok) {
          const explainData = await explainResponse.json();
          mlResult = { ...predictResult, ...explainData };
        }
      } catch (e) {
        console.warn('Explain endpoint call failed, using predict result:', e);
      }

      // Format SHAP factors for ShapExplanationChart UI component
      const shapFactorsList: ShapFactor[] = [];

      if (Array.isArray(mlResult.top_positive_factors)) {
        mlResult.top_positive_factors.forEach((f: any) => {
          shapFactorsList.push({
            feature: f.feature || f.raw_feature,
            impact: Number(f.impact),
            direction: 'Positive',
            importance: Math.abs(f.impact) > 0.2 ? 'High' : Math.abs(f.impact) > 0.1 ? 'Medium' : 'Low',
            description: f.description || `Increases success probability by +${Math.abs(f.impact).toFixed(2)}`,
          });
        });
      }

      if (Array.isArray(mlResult.top_negative_factors)) {
        mlResult.top_negative_factors.forEach((f: any) => {
          shapFactorsList.push({
            feature: f.feature || f.raw_feature,
            impact: Number(f.impact),
            direction: 'Negative',
            importance: Math.abs(f.impact) > 0.2 ? 'High' : Math.abs(f.impact) > 0.1 ? 'Medium' : 'Low',
            description: f.description || `Reduces success probability by -${Math.abs(f.impact).toFixed(2)}`,
          });
        });
      }

      // Extract probability directly from /predict response field: response.probability
      const prob = Number(predictResult.probability ?? mlResult.probability);
      console.log("CROWDFUNDAI FINAL PROBABILITY:", prob);
      const goal = Number(campaign.fundingGoal);
      const estFunding = Math.round(goal * (prob > 0.5 ? 1.15 + prob * 0.3 : prob * 0.8));

      const record: PredictionRecord = {
        id: `PRED-${Date.now().toString().slice(-6)}`,
        campaign,
        createdAt: new Date().toISOString(),
        status: 'completed',
        successProbability: prob,
        predictedFunding: estFunding,
        confidenceInterval: {
          lower: Math.max(0, prob - 0.08),
          upper: Math.min(1.0, prob + 0.08),
        },
        modelVersion: mlResult.modelVersion || 'v1.0-gradient-boosting',
        shapFactors: shapFactorsList.length > 0 ? shapFactorsList : null,
        positiveFactors: mlResult.top_positive_factors?.map((f: any) => f.feature) || null,
        riskFactors: mlResult.top_negative_factors?.map((f: any) => f.feature) || null,
        recommendations: null,
      };

      saveRecordToStorage(record);

      return {
        success: true,
        id: record.id,
        message: 'Prediction successfully generated by FastAPI ML model pipeline.',
        record,
        isModelConnected: true,
      };
    } catch (err: any) {
      return {
        success: false,
        id: null,
        message: err?.message || 'Failed to connect to FastAPI prediction endpoint.',
        record: null,
        isModelConnected: false,
      };
    }
  },

  /**
   * Retrieves prediction record by ID
   */
  async getPredictionById(id: string): Promise<PredictionRecord | null> {
    const records = getStoredRecords();
    const found = records.find((r) => r.id === id);
    if (found) return found;

    const health = await apiClient.checkHealth();
    if (!health.connected) return null;

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
   * Retrieves prediction history
   */
  async getPredictionHistory(filters?: {
    search?: string;
    category?: string;
    status?: string;
  }): Promise<PredictionRecord[]> {
    let records = getStoredRecords();

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      records = records.filter(
        (r) =>
          r.campaign.campaignName.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
      );
    }

    if (filters?.category && filters.category !== 'ALL') {
      records = records.filter((r) => r.campaign.category === filters.category);
    }

    return records;
  },
};
