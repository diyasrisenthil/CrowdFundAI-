/**
 * Analytics Service Layer
 * Aggregates campaign success predictions and platform statistics.
 * 
 * STRICT ACADEMIC INTEGRITY DIRECTIVE:
 * Does NOT generate fake data or read from localStorage fake stores.
 * Displays null / "Awaiting real data" when backend database is not connected.
 */

import { apiClient } from './apiClient';

export interface DashboardMetrics {
  totalCampaigns: number | null;
  predictionsGenerated: number | null;
  averageSuccessProbability: number | null;
  averagePredictedFunding: number | null;
  hasRealData: boolean;
  categoryDistribution: Array<{ category: string; count: number; successRate?: number }> | null;
  durationAnalysis: Array<{ durationRange: string; count: number; successRate?: number }> | null;
  goalAnalysis: Array<{ goalRange: string; count: number; successRate?: number }> | null;
  creatorExperienceAnalysis: Array<{ experience: string; count: number; successRate?: number }> | null;
  monthlyTrends: Array<{ month: string; predictionsCount: number; avgProbability?: number }> | null;
}

export const analyticsService = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const health = await apiClient.checkHealth();
    if (health.connected) {
      try {
        const res = await fetch(`${apiClient.getBaseUrl()}/analytics`);
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('Backend reachable but analytics failed:', e);
      }
    }

    // Authentic Stage 1 state: Awaiting real database integration
    // No fake data or simulated local counters
    return {
      totalCampaigns: null,
      predictionsGenerated: null,
      averageSuccessProbability: null,
      averagePredictedFunding: null,
      hasRealData: false,
      categoryDistribution: null,
      durationAnalysis: null,
      goalAnalysis: null,
      creatorExperienceAnalysis: null,
      monthlyTrends: null,
    };
  },
};
