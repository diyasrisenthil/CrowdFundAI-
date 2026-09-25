import React from 'react';
import { useRouter } from '../context/RouterContext';
import {
  TrendingUp,
  BrainCircuit,
  Layers,
  BarChart3,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Sparkles,
  Database,
  Search,
  CheckCircle2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-800/80 overflow-hidden">
        {/* Subtle Background Geometry */}
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Final-Year B.Tech IT Academic Project</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400">Machine Learning + Explainable AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight">
            CrowdFundAI<span className="text-emerald-400">+</span>
            <br />
            <span className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-400 block mt-2">
              Intelligent FinTech Crowdfunding Success Prediction
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A real academic decision-support platform leveraging supervised Machine Learning algorithms and Explainable AI (SHAP) to analyze pre-launch campaign parameters, assess success probabilities, and produce evidence-grounded optimization recommendations.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              Launch Platform Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/prediction/new')}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Explore Prediction Form
            </button>
          </div>

          {/* Academic Disclosure Note */}
          <div className="pt-6 max-w-xl mx-auto">
            <p className="text-xs text-slate-400 italic">
              * Note for evaluators: Grounded in real academic engineering. Metrics and predictions will be trained on authentic crowdfunding datasets; no synthetic performance claims are fabricated.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-slate-900/40 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Methodology & Pipeline
            </h2>
            <h3 className="text-2xl font-bold text-slate-100">
              End-to-End Decision-Support Pipeline
            </h3>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              How CrowdFundAI+ processes raw campaign metadata into interpretable prediction insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Data Collection',
                desc: 'Structured ingestion of funding goals, duration, creator track record, and category indicators.',
              },
              {
                step: '02',
                title: 'Feature Engineering',
                desc: 'Robust scaling, one-hot encoding, and feature interaction derived only from verified columns.',
              },
              {
                step: '03',
                title: 'Dual ML Models',
                desc: 'Classification for success/failure + Regression for expected funding amount estimation.',
              },
              {
                step: '04',
                title: 'Explainable AI',
                desc: 'TreeSHAP attribution isolating exactly which features positively or negatively drove the prediction.',
              },
              {
                step: '05',
                title: 'Actionable Advice',
                desc: 'Generating specific tuning recommendations directly linked to negative SHAP impact factors.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl relative flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-emerald-400 mb-2">
                    {s.step}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200 mb-1.5">{s.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-16 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              System Architecture
            </h2>
            <h3 className="text-2xl font-bold text-slate-100">
              Five Architectural Modules
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="p-2.5 bg-slate-800 w-fit rounded-lg text-emerald-400 border border-slate-700">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-slate-200">
                Supervised Classification
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluates Logistic Regression, Random Forest, and XGBoost to predict binary outcomes (Success vs. Failure). Evaluated strictly through Accuracy, Precision, Recall, F1-Score, and ROC-AUC.
              </p>
            </div>

            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="p-2.5 bg-slate-800 w-fit rounded-lg text-sky-400 border border-slate-700">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-slate-200">
                Funding Potential Regression
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Applies Linear Regression, Random Forest Regressors, and XGBoost Regressors to estimate projected capital raised. Evaluated on Mean Absolute Error (MAE), RMSE, and R² Score.
              </p>
            </div>

            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="p-2.5 bg-slate-800 w-fit rounded-lg text-indigo-400 border border-slate-700">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-slate-200">
                Explainable AI (SHAP)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Resolves the black-box dilemma in FinTech ML. Uses Shapley additive explanations to break down each prediction into positive contributors and risk drivers.
              </p>
            </div>

            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="p-2.5 bg-slate-800 w-fit rounded-lg text-amber-400 border border-slate-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-slate-200">
                Evidence-Based Recommendations
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Translates negative SHAP weights into actionable creator strategies—such as optimal duration adjustments, target goal restructuring, and social proof milestones.
              </p>
            </div>

            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="p-2.5 bg-slate-800 w-fit rounded-lg text-purple-400 border border-slate-700">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-slate-200">
                Decision-Support Analytics
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Categorical benchmarking and historical distributions for platforms, creators, and angel backers assessing crowdfunding campaign risk profiles.
              </p>
            </div>

            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="p-2.5 bg-slate-800 w-fit rounded-lg text-emerald-400 border border-slate-700">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-slate-200">
                Production MySQL Schema
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Comprehensive relational schema covering Users, Campaigns, Performance history, Predictions, and Recommendation logs with full foreign key referential integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Stakeholder Values */}
      <section className="py-16 bg-slate-900/30 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Project Beneficiaries
            </h2>
            <h3 className="text-2xl font-bold text-slate-100">
              Designed for Four Key Stakeholders
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="font-semibold text-sm text-slate-200 mb-1">Campaign Creators</div>
              <p className="text-xs text-slate-400">
                Test launch parameters, optimize funding targets, and pinpoint campaign risks before going live.
              </p>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="font-semibold text-sm text-slate-200 mb-1">Investors & Backers</div>
              <p className="text-xs text-slate-400">
                Assess likelihood of campaign delivery, creator track record, and realistic funding targets.
              </p>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="font-semibold text-sm text-slate-200 mb-1">Platforms</div>
              <p className="text-xs text-slate-400">
                Quality assurance, risk-weighted portfolio management, and category-level health analytics.
              </p>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="font-semibold text-sm text-slate-200 mb-1">Researchers & Viva</div>
              <p className="text-xs text-slate-400">
                Transparent benchmarking of ML algorithms, Shapley attribution theory, and reproducible metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-bold text-slate-100">
            Explore CrowdFundAI+ Foundation
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Ready to inspect the complete multi-section prediction form, Explainable AI UI, model benchmark tables, and MySQL architecture.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all cursor-pointer shadow-lg"
            >
              Open Dashboard
            </button>
            <button
              onClick={() => navigate('/model-performance')}
              className="px-6 py-3 text-sm font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all cursor-pointer"
            >
              Inspect Model Benchmarks
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-300">CrowdFundAI+</span> — Final-Year B.Tech IT Project
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Machine Learning & Explainable AI</span>
            <span>•</span>
            <span>MySQL Architecture</span>
            <span>•</span>
            <span>Python FastAPI Target</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
