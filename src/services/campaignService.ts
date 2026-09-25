/**
 * Campaign Service Layer
 * Interfaces between React UI and the backend database / API gateway (FastAPI + MySQL)
 * 
 * STRICT ACADEMIC INTEGRITY DIRECTIVE:
 * Does NOT generate fake campaigns or use localStorage as a fake database.
 * Real records require an active backend service and MySQL connection.
 */

import { CampaignInput } from '../types';
import { apiClient } from './apiClient';

export interface CampaignRecord {
  id: string;
  campaign: CampaignInput;
  createdAt: string;
  status: 'draft' | 'submitted' | 'active' | 'completed';
}

export const campaignService = {
  /**
   * Retrieves campaigns from MySQL database via backend API
   */
  async getCampaigns(): Promise<{
    success: boolean;
    data: CampaignRecord[];
    message: string;
    isBackendConnected: boolean;
  }> {
    const health = await apiClient.checkHealth();
    if (!health.connected) {
      return {
        success: false,
        data: [],
        message: 'Backend unavailable. MySQL database and FastAPI backend are not connected yet.',
        isBackendConnected: false,
      };
    }

    try {
      const response = await fetch(`${apiClient.getBaseUrl()}/campaigns`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
          message: 'Campaigns retrieved from database.',
          isBackendConnected: true,
        };
      }
      return {
        success: false,
        data: [],
        message: `Backend returned status ${response.status}`,
        isBackendConnected: true,
      };
    } catch (err: any) {
      return {
        success: false,
        data: [],
        message: err?.message || 'Failed to fetch campaigns from backend.',
        isBackendConnected: false,
      };
    }
  },

  /**
   * Retrieves single campaign by ID
   */
  async getCampaignById(id: string): Promise<CampaignRecord | null> {
    const health = await apiClient.checkHealth();
    if (!health.connected) {
      return null;
    }

    try {
      const response = await fetch(`${apiClient.getBaseUrl()}/campaigns/${id}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Submits campaign to backend database
   */
  async submitCampaign(campaign: CampaignInput): Promise<{
    success: boolean;
    id: string | null;
    message: string;
    isBackendConnected: boolean;
  }> {
    const health = await apiClient.checkHealth();
    if (!health.connected) {
      return {
        success: false,
        id: null,
        message: 'Backend unavailable. Database and FastAPI backend are not connected yet.',
        isBackendConnected: false,
      };
    }

    try {
      const response = await fetch(`${apiClient.getBaseUrl()}/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign),
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          id: result.id,
          message: 'Campaign recorded in database.',
          isBackendConnected: true,
        };
      }
      return {
        success: false,
        id: null,
        message: 'Failed to record campaign in database.',
        isBackendConnected: true,
      };
    } catch (err: any) {
      return {
        success: false,
        id: null,
        message: err?.message || 'Network error communicating with campaign backend.',
        isBackendConnected: false,
      };
    }
  },
};
