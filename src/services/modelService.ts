/**
 * Model Evaluation & Performance Service Layer
 * Interfaces with Module 3 (Classification) & Module 4 (Regression) evaluations
 * 
 * STRICT DIRECTIVE:
 * Never fabricate metrics, ROC curves, confusion matrices, or claim a model is trained
 * before real model training on the actual crowdfunding dataset.
 */

import { ModelComparisonItem, ClassificationMetrics, RegressionMetrics } from '../types';
import { apiClient } from './apiClient';

export interface ModelPerformanceState {
  isTrained: boolean;
  activeClassificationModel: string | null;
  activeRegressionModel: string | null;
  datasetIngested: boolean;
  datasetName: string | null;
  totalSamples: number | null;
  classificationModels: ModelComparisonItem[];
  regressionModels: ModelComparisonItem[];
  bestClassificationMetrics: ClassificationMetrics;
  bestRegressionMetrics: RegressionMetrics;
  confusionMatrix: {
    labels: string[];
    matrix: number[][] | null;
  };
  rocCurveData: Array<{ fpr: number; tpr: number }> | null;
  globalFeatureImportance: Array<{ feature: string; importance: number }> | null;
}

export const modelService = {
  /**
   * Fetches the current training and evaluation status from the ML pipeline
   */
  async getModelPerformance(): Promise<ModelPerformanceState> {
    const health = await apiClient.checkHealth();
    if (health.connected) {
      try {
        const res = await fetch(`${apiClient.getBaseUrl()}/model-performance`);
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('Failed to fetch real model metrics from backend:', e);
      }
    }

    // Default authentic state: Model not trained, awaiting dataset inspection
    return {
      isTrained: false,
      activeClassificationModel: null,
      activeRegressionModel: null,
      datasetIngested: false,
      datasetName: null,
      totalSamples: null,
      classificationModels: [
        {
          modelName: 'Logistic Regression',
          modelType: 'Classification',
          status: 'Not Trained',
          selectedAsBest: false,
          metrics: {
            Accuracy: null,
            Precision: null,
            Recall: null,
            'F1 Score': null,
            'ROC-AUC': null,
          },
          hyperparameters: {
            solver: 'lbfgs',
            max_iter: 1000,
            C: 1.0,
          },
        },
        {
          modelName: 'Random Forest',
          modelType: 'Classification',
          status: 'Not Trained',
          selectedAsBest: false,
          metrics: {
            Accuracy: null,
            Precision: null,
            Recall: null,
            'F1 Score': null,
            'ROC-AUC': null,
          },
          hyperparameters: {
            n_estimators: 200,
            max_depth: 15,
            min_samples_split: 5,
          },
        },
        {
          modelName: 'XGBoost',
          modelType: 'Classification',
          status: 'Not Trained',
          selectedAsBest: false,
          metrics: {
            Accuracy: null,
            Precision: null,
            Recall: null,
            'F1 Score': null,
            'ROC-AUC': null,
          },
          hyperparameters: {
            learning_rate: 0.05,
            n_estimators: 300,
            max_depth: 6,
            eval_metric: 'logloss',
          },
        },
      ],
      regressionModels: [
        {
          modelName: 'Linear Regression',
          modelType: 'Regression',
          status: 'Not Trained',
          selectedAsBest: false,
          metrics: {
            MAE: null,
            RMSE: null,
            'R² Score': null,
          },
          hyperparameters: {
            fit_intercept: true,
          },
        },
        {
          modelName: 'Random Forest Regressor',
          modelType: 'Regression',
          status: 'Not Trained',
          selectedAsBest: false,
          metrics: {
            MAE: null,
            RMSE: null,
            'R² Score': null,
          },
          hyperparameters: {
            n_estimators: 200,
            max_depth: 12,
          },
        },
        {
          modelName: 'XGBoost Regressor',
          modelType: 'Regression',
          status: 'Not Trained',
          selectedAsBest: false,
          metrics: {
            MAE: null,
            RMSE: null,
            'R² Score': null,
          },
          hyperparameters: {
            learning_rate: 0.05,
            n_estimators: 250,
            max_depth: 6,
          },
        },
      ],
      bestClassificationMetrics: {
        accuracy: null,
        precision: null,
        recall: null,
        f1Score: null,
        rocAuc: null,
      },
      bestRegressionMetrics: {
        mae: null,
        rmse: null,
        r2Score: null,
      },
      confusionMatrix: {
        labels: ['Predicted: Failed', 'Predicted: Successful'],
        matrix: null, // Null until real confusion matrix is computed on test set
      },
      rocCurveData: null,
      globalFeatureImportance: null,
    };
  },
};
