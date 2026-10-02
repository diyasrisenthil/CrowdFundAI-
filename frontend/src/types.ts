/**
 * CrowdFundAI+ — Core TypeScript Type Definitions
 * Designed for real ML model pipeline & MySQL database integration.
 */

// Module 1: Data Collection & Management Entities
export interface CampaignInput {
  // Legitimate pre-launch dataset features
  campaignName: string;
  category: CampaignCategory;
  subCategory?: string;
  country: string;
  currency: string;

  fundingGoal: number; // in USD
  campaignDuration: number; // in days
  launchMonth?: number; // 1-12
  launchHour?: number; // 0-23
}

export type CampaignCategory =
  | 'Art'
  | 'Comics'
  | 'Crafts'
  | 'Dance'
  | 'Design'
  | 'Fashion'
  | 'Film & Video'
  | 'Food'
  | 'Games'
  | 'Journalism'
  | 'Music'
  | 'Photography'
  | 'Publishing'
  | 'Technology'
  | 'Theater';

// Module 3 & 4: Prediction & Regression Output Entities
export interface ShapFactor {
  feature: string;
  impact: number; // SHAP value (positive or negative)
  direction: 'Positive' | 'Negative';
  importance: 'High' | 'Medium' | 'Low';
  description?: string;
}

export interface CampaignRecommendation {
  id: string;
  factor: string;
  recommendation: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Goal Optimization' | 'Engagement' | 'Campaign Duration' | 'Creator Credibility' | 'Rewards';
}

export interface PredictionRecord {
  id: string;
  campaign: CampaignInput;
  createdAt: string;
  status: 'pending_model' | 'completed' | 'failed';
  
  // Real ML outputs (null until real model is connected and evaluated)
  successProbability: number | null; // e.g. 0.742 (74.2%)
  predictedFunding: number | null; // Regression result in USD
  confidenceInterval?: {
    lower: number;
    upper: number;
  } | null;
  modelVersion: string | null;

  // Module 5: Explainable AI & SHAP
  shapFactors: ShapFactor[] | null;
  positiveFactors: string[] | null;
  riskFactors: string[] | null;
  recommendations: CampaignRecommendation[] | null;
}

// Module 3 & 4 Evaluation Metrics
export interface ClassificationMetrics {
  accuracy: number | null;
  precision: number | null;
  recall: number | null;
  f1Score: number | null;
  rocAuc: number | null;
}

export interface RegressionMetrics {
  mae: number | null;
  rmse: number | null;
  r2Score: number | null;
}

export interface ModelComparisonItem {
  modelName: 'Logistic Regression' | 'Decision Tree' | 'Random Forest' | 'Gradient Boosting' | 'XGBoost' | 'Linear Regression' | 'Random Forest Regressor' | 'XGBoost Regressor';
  modelType: 'Classification' | 'Regression';
  status: 'Trained' | 'Not Trained' | 'Evaluating';
  selectedAsBest: boolean;
  metrics: Record<string, number | null>;
  hyperparameters?: Record<string, string | number | boolean>;
}

// MySQL Schema Representation (Viva Ready)
export interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface DatabaseCampaign {
  id: string;
  user_id: string;
  campaign_name: string;
  category: string;
  country: string;
  funding_goal: number;
  campaign_duration: number;
  creator_experience: string;
  previous_campaign_count: number;
  created_at: string;
}

export interface DatabasePerformance {
  id: string;
  campaign_id: string;
  backers: number;
  engagement_score: number;
  funds_raised: number;
  recorded_at: string;
}

export interface DatabasePrediction {
  id: string;
  campaign_id: string;
  success_probability: number | null;
  predicted_funding: number | null;
  confidence: number | null;
  model_version: string | null;
  prediction_date: string;
}
