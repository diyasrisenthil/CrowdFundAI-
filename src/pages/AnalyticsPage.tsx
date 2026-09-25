import React, { useEffect, useState } from 'react';
import { analyticsService, DashboardMetrics } from '../services/analyticsService';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Clock,
  DollarSign,
  UserCheck,
  Database,
  HelpCircle,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await analyticsService.getDashboardMetrics();
        setMetrics(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadMetrics();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Portfolio Intelligence
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-xs text-slate-400">Empirical Analytics</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Crowdfunding Decision-Support Analytics
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Aggregate distributions across categories, duration thresholds, and funding goals.
            </p>
          </div>
          <StatusBadge label="Awaiting Real Database Ingestion" variant="warning" size="sm" />
        </div>
      </div>

      {/* Grounding Callout */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
        <div className="flex items-center gap-2 font-semibold text-slate-300">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Academic Grounding Directives:</span>
        </div>
        <p className="leading-relaxed">
          The charts below are connected to <code>analyticsService.getDashboardMetrics()</code>. In Stage 1, all charts safely display their unpopulated empty states rather than generating synthetic graphs. When your MySQL database is seeded with authentic campaign records, these charts will render real Recharts visualizations.
        </p>
      </div>

      {/* Grid of 6 Analytics Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Success Probability Distribution */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Success Probability Distribution
              </h2>
              <p className="text-xs text-slate-400">
                Histogram of model prediction probabilities [0.0 – 1.0]
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Recharts BarChart</span>
          </div>
          <EmptyState
            title="Distribution Data Unavailable"
            description="Probability distribution histogram will plot frequency density bins once the classification model evaluates the validation set."
            icon={BarChart3}
            badgeText="Module 3 Output"
          />
        </div>

        {/* 2. Funding Prediction Trends */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                Funding Prediction Trends
              </h2>
              <p className="text-xs text-slate-400">
                Temporal trends in requested vs. predicted funding capital
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Recharts LineChart</span>
          </div>
          <EmptyState
            title="Time-Series Records Unavailable"
            description="Monthly and quarterly trendlines will plot capital momentum once time-stamped campaign performance records are queried from MySQL."
            icon={TrendingUp}
            badgeText="Module 4 Output"
          />
        </div>

        {/* 3. Category Analysis */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-purple-400" />
                Category Performance Breakdown
              </h2>
              <p className="text-xs text-slate-400">
                Success rate comparison across tech, hardware, arts, and games
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Recharts RadarChart</span>
          </div>
          <EmptyState
            title="Category Metrics Unavailable"
            description="Cross-categorical success rates require aggregating the verified dataset columns grouped by category."
            icon={PieChart}
            badgeText="Categorical Features"
          />
        </div>

        {/* 4. Campaign Duration Analysis */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Campaign Duration vs. Success Rate
              </h2>
              <p className="text-xs text-slate-400">
                Correlation between campaign lifespan (15, 30, 45, 60 days) and completion
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Recharts ScatterPlot</span>
          </div>
          <EmptyState
            title="Lifespan Correlation Unavailable"
            description="Analyzes the empirical tipping point where prolonged campaign duration increases backer attrition."
            icon={Clock}
            badgeText="Duration Bins"
          />
        </div>

        {/* 5. Funding Goal Analysis */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Funding Goal Elasticity Analysis
              </h2>
              <p className="text-xs text-slate-400">
                Success probability curve as funding goals scale logarithmically
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Recharts AreaChart</span>
          </div>
          <EmptyState
            title="Elasticity Curve Unavailable"
            description="Shows the threshold where high funding goals trigger negative SHAP attributions."
            icon={DollarSign}
            badgeText="Financial Modeling"
          />
        </div>

        {/* 6. Creator Experience Analysis */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                Creator Experience Impact
              </h2>
              <p className="text-xs text-slate-400">
                Probability uplift comparing first-time vs. serial campaigners
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Recharts BarChart</span>
          </div>
          <EmptyState
            title="Experience Correlation Unavailable"
            description="Measures creator credibility weight inside Random Forest and XGBoost decision trees."
            icon={UserCheck}
            badgeText="Creator History"
          />
        </div>

      </div>

    </div>
  );
};
