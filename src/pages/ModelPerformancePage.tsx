import React, { useEffect, useState } from 'react';
import { modelService, ModelPerformanceState } from '../services/modelService';
import { ModelComparisonTable } from '../components/ModelComparisonTable';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import {
  Cpu,
  TrendingUp,
  Activity,
  Layers,
  HelpCircle,
  Database,
  BarChart2,
  GitCompare,
  Sliders,
  ShieldCheck,
  Grid3X3,
} from 'lucide-react';

export const ModelPerformancePage: React.FC = () => {
  const [perfState, setPerfState] = useState<ModelPerformanceState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPerformance() {
      try {
        const state = await modelService.getModelPerformance();
        setPerfState(state);
      } finally {
        setIsLoading(false);
      }
    }
    loadPerformance();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Modules 3, 4 & 5
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-xs text-slate-400">Model Evaluation Benchmarks</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Machine Learning Model Evaluation & Monitoring
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical metrics for classification, continuous regression targets, and SHAP explainability.
            </p>
          </div>
          <StatusBadge label="Model Not Trained (Pending Pipeline)" variant="warning" size="sm" />
        </div>
      </div>

      {/* Academic Defense Guideline */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Viva Rule on Model Selection:</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The system evaluates multiple candidate algorithms across <strong>Classification</strong> (Logistic Regression, Random Forest, XGBoost) and <strong>Regression</strong> (Linear Regression, Random Forest Regressor, XGBoost Regressor). Per academic requirements, the best model is <strong>not pre-selected</strong> and no metrics are simulated. It will be determined exclusively by cross-validation once the dataset is ingested into Python.
        </p>
      </div>

      {/* Top Best Metrics Summary Cards (Classification & Regression) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Accuracy / ROC-AUC */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Best Accuracy / ROC-AUC
          </span>
          <div className="text-lg font-bold text-amber-400 font-mono">
            Model not trained
          </div>
          <p className="text-[11px] text-slate-500">
            Target: Classification Success (Module 3)
          </p>
        </div>

        {/* Metric 2: Precision & Recall */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Precision & Recall (F1)
          </span>
          <div className="text-lg font-bold text-amber-400 font-mono">
            Model not trained
          </div>
          <p className="text-[11px] text-slate-500">
            Evaluates False Positive / False Negative balance
          </p>
        </div>

        {/* Metric 3: Regression MAE */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Best Regression MAE
          </span>
          <div className="text-lg font-bold text-amber-400 font-mono">
            Model not trained
          </div>
          <p className="text-[11px] text-slate-500">
            Target: Mean Absolute Dollar Error (Module 4)
          </p>
        </div>

        {/* Metric 4: Regression R² */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            R² Variance Explained
          </span>
          <div className="text-lg font-bold text-amber-400 font-mono">
            Model not trained
          </div>
          <p className="text-[11px] text-slate-500">
            Proportion of variance explained by features
          </p>
        </div>

      </div>

      {/* Module 3: Classification Model Comparison Table */}
      {perfState && (
        <ModelComparisonTable
          title="Module 3: Classification Model Comparison (Success / Failure)"
          subtitle="Empirical comparison between linear, bagging, and gradient boosted tree algorithms"
          models={perfState.classificationModels}
          metricKeys={['Accuracy', 'Precision', 'Recall', 'F1 Score', 'ROC-AUC']}
        />
      )}

      {/* Module 4: Regression Model Comparison Table */}
      {perfState && (
        <ModelComparisonTable
          title="Module 4: Funding Potential Estimation (Regression Amount)"
          subtitle="Continuous evaluation of predicted vs actual funds raised"
          models={perfState.regressionModels}
          metricKeys={['MAE', 'RMSE', 'R² Score']}
        />
      )}

      {/* Evaluation Diagnostic Visualizations (Confusion Matrix, ROC Curve, Feature Importance, SHAP Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Diagnostic 1: Confusion Matrix Placeholder */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Grid3X3 className="w-4 h-4 text-emerald-400" />
                Binary Confusion Matrix
              </h2>
              <p className="text-xs text-slate-400">
                True Positives, False Positives, True Negatives, False Negatives
              </p>
            </div>
            <StatusBadge label="Model Not Trained" variant="warning" size="sm" />
          </div>

          <EmptyState
            title="Confusion Matrix Awaiting Test Split"
            description="The 2x2 confusion matrix will calculate once the selected classification model executes over the holdout test dataset."
            icon={Grid3X3}
            badgeText="Classification Diagnostic"
          />
        </div>

        {/* Diagnostic 2: ROC Curve Placeholder */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" />
                ROC Curve & AUC Calibration
              </h2>
              <p className="text-xs text-slate-400">
                True Positive Rate vs False Positive Rate across probability thresholds
              </p>
            </div>
            <StatusBadge label="Model Not Trained" variant="warning" size="sm" />
          </div>

          <EmptyState
            title="ROC Curve Awaiting Threshold Sweep"
            description="Receiver Operating Characteristic curve will plot TPR against FPR across classification thresholds [0.0 to 1.0]."
            icon={Activity}
            badgeText="ROC-AUC Diagnostic"
          />
        </div>

        {/* Diagnostic 3: Global Feature Importance Placeholder */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-400" />
                Global Feature Importance (Gini / Gain)
              </h2>
              <p className="text-xs text-slate-400">
                Random Forest MDI & XGBoost Weight/Gain rankings
              </p>
            </div>
            <StatusBadge label="Model Not Trained" variant="warning" size="sm" />
          </div>

          <EmptyState
            title="Feature Importance Ranking Unavailable"
            description="Global feature rankings will display the highest weighted campaign indicators (e.g. goal, duration, creator track record)."
            icon={BarChart2}
            badgeText="Tree Importance"
          />
        </div>

        {/* Diagnostic 4: Global SHAP Summary Plot Placeholder */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Global SHAP Summary Beeswarm
              </h2>
              <p className="text-xs text-slate-400">
                Distribution of impact across all validation campaigns
              </p>
            </div>
            <StatusBadge label="Model Not Trained" variant="warning" size="sm" />
          </div>

          <EmptyState
            title="SHAP Summary Plot Unavailable"
            description="Global SHAP beeswarm will plot the directional impact of high vs low feature values across all test campaigns."
            icon={Layers}
            badgeText="Explainable AI Summary"
          />
        </div>

      </div>

    </div>
  );
};
