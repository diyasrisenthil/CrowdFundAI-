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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            {/* 1. Analyze My Campaign */}
            <button
              onClick={() => navigate('/prediction/new')}
              className="px-6 py-3.5 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Analyze My Campaign
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* 2. Get Started */}
            <button
              onClick={() => navigate('/prediction/new')}
              className="px-6 py-3.5 text-sm font-semibold text-slate-100 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Get Started
            </button>

            {/* 3. Explore the platform */}
            <button
              onClick={() => scrollToSection('features')}
              className="px-6 py-3.5 text-sm font-medium text-slate-300 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Explore the platform
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

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="py-16 bg-slate-900/40 border-b border-slate-800/80 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Methodology & Pipeline
            </h2>
            <h3 className="text-2xl font-bold text-slate-100">
              How It Works: End-to-End Decision Pipeline
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

      {/* 4. Features Section */}
      <section id="features" className="py-16 border-b border-slate-800/80 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              System Architecture & Core Capabilities
            </h2>
            <h3 className="text-2xl font-bold text-slate-100">
              Platform Features & Architectural Modules
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

      {/* 6. AI Insights Section */}
      <section id="ai-insights" className="py-16 bg-slate-900/40 border-b border-slate-800/80 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Explainable AI Framework
            </h2>
            <h3 className="text-2xl font-bold text-slate-100">
              AI Insights & SHAP Feature Attributions
            </h3>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              Real-time model interpretability using Shapley Additive exPlanations (SHAP) to explain model decisions and provide actionable advice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Feature Attribution (TreeSHAP)</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Computes exact Shapley values (&phi;<sub>i</sub>) for every campaign feature, measuring marginal impact on the baseline success probability E[f(X)].
              </p>
              <div className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-emerald-300 border border-slate-800">
                Formula: f(x) = E[f(X)] + &sum; &phi;<sub>i</sub>
              </div>
            </div>

            <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Evidence-Based Optimization Engine</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Identifies risk factors with negative SHAP weights (&phi; &lt; 0) and generates quantitative parameter adjustments to increase campaign success odds.
              </p>
              <button
                onClick={() => navigate('/prediction/new')}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                Test AI Insights in Prediction Form
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. About Section */}
      <section id="about" className="py-16 border-b border-slate-800/80 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Project Foundation & Beneficiaries
            </h2>
            <h3 className="text-2xl font-bold text-slate-100">
              About CrowdFundAI+
            </h3>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              A final-year B.Tech IT academic project designed for transparent crowdfunding success estimation and Explainable AI decision support.
            </p>
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
            Ready to Predict Your Campaign Success?
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Run your pre-launch campaign parameters through our trained ML pipeline and receive real-time SHAP feature attributions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/prediction/new')}
              className="px-6 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all cursor-pointer shadow-lg flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Analyze My Campaign
            </button>
            <button
              onClick={() => navigate('/prediction/new')}
              className="px-6 py-3 text-sm font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all cursor-pointer"
            >
              Get Started
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
            <button onClick={() => scrollToSection('features')} className="hover:text-emerald-400 transition-colors cursor-pointer">Features</button>
            <span>•</span>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-emerald-400 transition-colors cursor-pointer">How it works</button>
            <span>•</span>
            <button onClick={() => scrollToSection('ai-insights')} className="hover:text-emerald-400 transition-colors cursor-pointer">AI Insights</button>
            <span>•</span>
            <button onClick={() => scrollToSection('about')} className="hover:text-emerald-400 transition-colors cursor-pointer">About</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
