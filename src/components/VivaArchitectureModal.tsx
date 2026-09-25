import React, { useState } from 'react';
import { X, Database, Cpu, Layers, GitBranch, CheckCircle2, ShieldAlert } from 'lucide-react';

interface VivaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VivaArchitectureModal: React.FC<VivaModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'database' | 'python-api'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                Final-Year B.Tech IT Project
              </span>
              <span className="text-xs text-slate-400">Architecture Specification</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-1">
              CrowdFundAI+ System Architecture & Viva Defence Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Academic Scope & Integrity
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'modules'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            5 Core ML Modules
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'database'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            MySQL DDL Schema
          </button>
          <button
            onClick={() => setActiveTab('python-api')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'python-api'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Python ML API Contract
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-emerald-200">
                <div className="flex items-center gap-2 font-semibold text-emerald-300 mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Real Academic ML Grounding (Zero Fake AI)
                </div>
                <p className="text-xs text-emerald-300/80 leading-relaxed">
                  In strict compliance with academic standards, CrowdFundAI+ does not invent synthetic predictions, fabricated accuracy percentages, or hardcoded mock datasets. All ML outputs and database analytics remain strictly labeled as <strong>"Awaiting real data"</strong> and <strong>"Model not trained"</strong> until real Python model pipelines (scikit-learn/XGBoost/SHAP) and MySQL instances are executed.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <h4 className="font-semibold text-slate-200 flex items-center gap-2 mb-2">
                    <Cpu className="w-4 h-4 text-sky-400" />
                    Frontend & Presentation Layer
                  </h4>
                  <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                    <li>React 19 + TypeScript component hierarchy</li>
                    <li>Tailwind CSS design system styled for FinTech analytics</li>
                    <li>Recharts data visualization engine with safe empty states</li>
                    <li>Service-oriented API client layer decoupling UI from ML logic</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <h4 className="font-semibold text-slate-200 flex items-center gap-2 mb-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    Eventual Backend & ML Stack
                  </h4>
                  <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                    <li>Python 3.11+ with FastAPI RESTful API microservice</li>
                    <li>pandas, numpy, scikit-learn, and XGBoost pipeline</li>
                    <li>TreeSHAP & KernelSHAP local and global explainability</li>
                    <li>Relational MySQL 8.0 database engine</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-xs font-semibold text-sky-400">MODULE 1</span>
                  <h4 className="font-semibold text-slate-200 text-sm">Data Collection & Ingestion</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Accepts campaign metadata (Goal, Duration, Category, Creator History, Engagement indicators). Will import historical crowdfunding datasets (e.g., Kickstarter / Indiegogo archives) without column assumptions.
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-xs font-semibold text-indigo-400">MODULE 2</span>
                  <h4 className="font-semibold text-slate-200 text-sm">Preprocessing & Feature Engineering</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Missing-value imputation, One-Hot/Target encoding, StandardScaler/RobustScaler for skewed financial targets, engineered ratios (e.g. goal-per-day, historical creator success rate).
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-xs font-semibold text-emerald-400">MODULE 3</span>
                  <h4 className="font-semibold text-slate-200 text-sm">Classification: Success / Failure Prediction</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Evaluates Logistic Regression, Random Forest, and XGBoost on test split using Accuracy, Precision, Recall, F1-Score, and ROC-AUC. Model selection is purely empirical.
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-xs font-semibold text-amber-400">MODULE 4</span>
                  <h4 className="font-semibold text-slate-200 text-sm">Regression: Funding Potential Estimation</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Estimates projected final funding amount via Linear Regression, Random Forest Regressor, and XGBoost Regressor; evaluated via MAE, RMSE, and R² Score.
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                  <span className="text-xs font-semibold text-purple-400">MODULE 5</span>
                  <h4 className="font-semibold text-slate-200 text-sm">Explainable AI (SHAP) & Recommendation Engine</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Calculates Shapley values representing marginal feature attributions: $f(x) = E[f(X)] + \sum \phi_i$. Features with negative impact generate actionable campaign optimization recommendations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>MySQL Relational Entities Defined in <code>src/db/schema.sql</code></span>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`-- 1. USERS (id, name, email, password_hash, role, created_at)
-- 2. CAMPAIGNS (id, user_id, campaign_name, category, country, funding_goal, 
--               campaign_duration, creator_experience, previous_campaign_count, created_at)
-- 3. CAMPAIGN_PERFORMANCE (id, campaign_id, backers, engagement_rate, funds_raised, outcome)
-- 4. PREDICTIONS (id, campaign_id, success_probability, predicted_funding, confidence_score, model_version)
-- 5. RECOMMENDATIONS (id, prediction_id, factor, recommendation, priority, category)`}
              </pre>
            </div>
          )}

          {activeTab === 'python-api' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <GitBranch className="w-4 h-4 text-sky-400" />
                <span>FastAPI Python Service Contract Specification</span>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`POST /api/predictions
Request: { campaignName, category, country, fundingGoal, campaignDuration, creatorExperience, ... }
Response: { 
  id: "PRED-1029",
  successProbability: 0.814,
  predictedFunding: 42500.00,
  modelVersion: "XGBoost-Classifier-v1.0",
  shapFactors: [
    { feature: "creator_experience", impact: +0.24, direction: "Positive", importance: "High" },
    { feature: "funding_goal", impact: -0.18, direction: "Negative", importance: "High" }
  ],
  recommendations: [
    { factor: "funding_goal", recommendation: "Consider structuring funding in stretch goals.", priority: "High" }
  ]
}`}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-amber-400/90">
            <ShieldAlert className="w-3.5 h-3.5" />
            Stage 1: Frontend Architecture & Client Contracts Implemented
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
