import React, { useEffect, useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { analyticsService, DashboardMetrics } from '../services/analyticsService';
import { predictionService } from '../services/predictionService';
import { PredictionRecord } from '../types';
import { MetricCard } from '../components/MetricCard';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import {
  Layers,
  Sparkles,
  Percent,
  DollarSign,
  PlusCircle,
  History,
  BarChart3,
  ArrowRight,
  TrendingUp,
  Cpu,
  Database,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { navigate } = useRouter();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentPredictions, setRecentPredictions] = useState<PredictionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const m = await analyticsService.getDashboardMetrics();
        setMetrics(m);
        const history = await predictionService.getPredictionHistory();
        setRecentPredictions(history.slice(0, 5));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              CrowdFundAI+ Decision Support
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Pre-Launch Decision Support</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Crowdfunding Analytics & Inference Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Machine Learning-based crowdfunding decision support, model evaluation benchmarks, and pre-launch campaign analysis.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/prediction/new')}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New Prediction
          </button>
          <button
            onClick={() => navigate('/history')}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analytics
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Campaigns"
          value={metrics?.totalCampaigns ?? null}
          subtitle="Awaiting MySQL database connection"
          statusText="Unsynced"
          icon={Layers}
          tooltip="Total historical campaign corpus ingested into MySQL database."
        />
        <MetricCard
          title="Predictions Generated"
          value={metrics?.predictionsGenerated ?? null}
          subtitle="Awaiting prediction service connection"
          statusText="Unconnected"
          icon={Sparkles}
          tooltip="Total campaigns evaluated through the real ML inference pipeline."
        />
        <MetricCard
          title="Avg. Success Probability"
          value={metrics?.averageSuccessProbability ?? null}
          subtitle="Requires trained ML classification model"
          statusText="Uncalibrated"
          icon={Percent}
          tooltip="Average probability across processed campaigns (calculated only after model training)."
        />
        <MetricCard
          title="Avg. Predicted Funding"
          value={metrics?.averagePredictedFunding ?? null}
          subtitle="Requires trained regression model"
          statusText="Uncalibrated"
          icon={DollarSign}
          tooltip="Mean regression funding target estimated across campaign corpus."
        />
      </div>

      {/* Section 1: Success Probability Overview & Funding Potential Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Success Probability Overview */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-400" />
                Success Probability Overview
              </h2>
              <p className="text-xs text-slate-400">
                Classification model predictions (Module 3)
              </p>
            </div>
            <StatusBadge label="Awaiting ML Model" variant="warning" size="sm" />
          </div>

          <EmptyState
            title="Classification Model Not Yet Connected"
            description="The ML pipeline has not been trained on the real dataset yet. Supervised models (Logistic Regression, Random Forest, XGBoost) will produce authentic binary probability distributions once connected."
            icon={Cpu}
            badgeText="Module 3: Classification"
          />
        </div>

        {/* 2. Funding Potential Overview */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-sky-400" />
                Funding Potential Overview
              </h2>
              <p className="text-xs text-slate-400">
                Continuous target regression output (Module 4)
              </p>
            </div>
            <StatusBadge label="Awaiting Regression Model" variant="warning" size="sm" />
          </div>

          <EmptyState
            title="Regression Estimator Not Yet Connected"
            description="Expected final funding amount will be predicted using Linear Regression, Random Forest Regressor, and XGBoost Regressors once the regression pipeline is linked to the backend service."
            icon={TrendingUp}
            actionLabel="View Model Specs"
            onAction={() => navigate('/model-performance')}
            badgeText="Module 4: Regression"
          />
        </div>
      </div>

      {/* Section 2: Recent Predictions & Campaign Category Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Predictions Table (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" />
                Recent Predictions
              </h2>
              <p className="text-xs text-slate-400">
                Campaigns evaluated by ML pipeline
              </p>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {recentPredictions.length === 0 ? (
            <EmptyState
              title="No prediction records available yet."
              description="Prediction history will appear here after the real ML prediction service and database are connected."
              icon={History}
              badgeText="Awaiting Prediction Pipeline"
            />
          ) : (
            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Campaign</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Goal ($)</th>
                    <th className="py-2.5 px-3">ML Status</th>
                    <th className="py-2.5 px-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {recentPredictions.map((pred) => (
                    <tr key={pred.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-3 font-sans font-medium text-slate-200">
                        {pred.campaign.campaignName}
                        <div className="text-[10px] text-slate-400 font-mono">{pred.id}</div>
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-300">
                        {pred.campaign.category}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        ${pred.campaign.fundingGoal.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-sans">
                        <StatusBadge
                          label={pred.status === 'completed' ? 'Evaluated' : 'Pending Model'}
                          variant={pred.status === 'completed' ? 'success' : 'warning'}
                          size="sm"
                        />
                      </td>
                      <td className="py-3 px-3 text-right font-sans">
                        <button
                          onClick={() => navigate(`/prediction/${pred.id}`)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Campaign Category Analysis (1 Col) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                Category Distribution
              </h2>
              <p className="text-xs text-slate-400">
                Breakdown by vertical
              </p>
            </div>
          </div>

          <EmptyState
            title="Awaiting Database Data"
            description="Campaign distribution across categories (Tech, FinTech, Design, Hardware, Games) will populate automatically when the dataset is imported into MySQL."
            icon={Database}
            badgeText="MySQL Database"
          />
        </div>
      </div>

    </div>
  );
};
