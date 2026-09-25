import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { predictionService } from '../services/predictionService';
import { CampaignInput, CampaignCategory } from '../types';
import {
  Sparkles,
  Info,
  Layers,
  DollarSign,
  User,
  Share2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

const CATEGORIES: CampaignCategory[] = [
  'Technology',
  'FinTech',
  'Design & Hardware',
  'Games',
  'Film & Video',
  'Publishing',
  'Music',
  'Art',
  'Food & Craft',
  'Community & Social',
];

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IN', name: 'India' },
  { code: 'AU', name: 'Australia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'OTHER', name: 'Other International' },
];

interface FormState {
  campaignName: string;
  category: CampaignCategory | '';
  country: string;
  fundingGoal: number | '';
  campaignDuration: number | '';
  creatorExperience: 'First-time' | '1-2 Prior Campaigns' | '3+ Prior Campaigns' | 'Serial Crowdfunder' | '';
  previousCampaignCount: number | '';
  hasVideo: boolean;
  preLaunchFollowers: number | '';
  rewardTierCount: number | '';
}

export const NewPredictionPage: React.FC = () => {
  const { navigate } = useRouter();

  // Form State: strictly unassumed defaults as mandated by academic guidelines
  const [formData, setFormData] = useState<FormState>({
    campaignName: '',
    category: '',
    country: '',
    fundingGoal: '',
    campaignDuration: '',
    creatorExperience: '',
    previousCampaignCount: '',
    hasVideo: false,
    preLaunchFollowers: '',
    rewardTierCount: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    message: string;
    id: string;
  } | null>(null);
  const [backendNotice, setBackendNotice] = useState<{
    title: string;
    message: string;
  } | null>(null);

  // Validation
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.campaignName.trim()) {
      errs.campaignName = 'Campaign name is required.';
    } else if (formData.campaignName.trim().length < 3) {
      errs.campaignName = 'Campaign name must be at least 3 characters.';
    }

    if (!formData.category) {
      errs.category = 'Please select a campaign category.';
    }

    if (!formData.country) {
      errs.country = 'Please select a country.';
    }

    if (formData.fundingGoal === '' || formData.fundingGoal <= 0) {
      errs.fundingGoal = 'Funding goal must be a positive number greater than $0.';
    } else if (formData.fundingGoal > 50000000) {
      errs.fundingGoal = 'Funding goal exceeds platform threshold ($50M).';
    }

    if (
      formData.campaignDuration === '' ||
      formData.campaignDuration < 1 ||
      formData.campaignDuration > 90
    ) {
      errs.campaignDuration = 'Campaign duration must be between 1 and 90 days.';
    }

    if (!formData.creatorExperience) {
      errs.creatorExperience = 'Please select creator experience level.';
    }

    if (formData.previousCampaignCount !== '' && formData.previousCampaignCount < 0) {
      errs.previousCampaignCount = 'Previous campaign count cannot be negative.';
    }

    if (formData.rewardTierCount !== '' && formData.rewardTierCount < 1) {
      errs.rewardTierCount = 'Reward tier count must be at least 1.';
    }

    if (formData.preLaunchFollowers !== '' && formData.preLaunchFollowers < 0) {
      errs.preLaunchFollowers = 'Pre-launch followers cannot be negative.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmissionFeedback(null);
    setBackendNotice(null);

    // Clean data object ready to be sent to Python ML API
    const payload: CampaignInput = {
      campaignName: formData.campaignName.trim(),
      category: formData.category as CampaignCategory,
      country: formData.country,
      fundingGoal: Number(formData.fundingGoal),
      campaignDuration: Number(formData.campaignDuration),
      creatorExperience: formData.creatorExperience as any,
      previousCampaignCount: formData.previousCampaignCount === '' ? 0 : Number(formData.previousCampaignCount),
      hasVideo: formData.hasVideo,
      preLaunchFollowers: formData.preLaunchFollowers === '' ? 0 : Number(formData.preLaunchFollowers),
      rewardTierCount: formData.rewardTierCount === '' ? 1 : Number(formData.rewardTierCount),
    };

    try {
      const result = await predictionService.predictCampaign(payload);

      if (result.success && result.id) {
        setSubmissionFeedback({
          message: result.message,
          id: result.id,
        });
        setTimeout(() => {
          navigate(`/prediction/${result.id}`);
        }, 1000);
      } else {
        // Authentic Stage 1 state: backend is offline / not connected
        // Do NOT generate fake prediction data or redirect to fake results
        setBackendNotice({
          title: 'Backend Unavailable — ML Pipeline Not Connected',
          message:
            result.message ||
            'The Python FastAPI prediction service and MySQL database are not connected yet. Campaign parameters have been validated and formatted for transmission to the Python ML API once deployed.',
        });
      }
    } catch (err: any) {
      setErrors({ form: err?.message || 'Failed to communicate with prediction service.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Modules 1 & 2: Ingestion & Features
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-xs text-slate-400">Pre-Launch Decision Support</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          New Campaign Success Prediction
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Enter verified pre-launch campaign parameters. The form structure is engineered to map directly to Python feature pipelines without synthetic data fabrication.
        </p>
      </div>

      {/* Academic Transparency Callout */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-3">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <span className="font-semibold text-slate-200">
            Clean ML Service Abstraction:
          </span>
          <p className="text-slate-400 leading-relaxed">
            Submitting this form dispatches the campaign payload to <code>predictionService.predictCampaign()</code>. If a Python backend (FastAPI) is running at the configured endpoint, inference will execute. If the backend is unavailable, the system safely reports the connection status without fabricating fake probabilities or fake prediction records.
          </p>
        </div>
      </div>

      {/* Backend Unavailable Notice */}
      {backendNotice && (
        <div className="p-4 bg-amber-950/50 border border-amber-800/80 rounded-xl flex items-start gap-3 text-xs text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-amber-300">{backendNotice.title}</div>
            <p className="text-amber-200/90 leading-relaxed">{backendNotice.message}</p>
          </div>
        </div>
      )}

      {/* Submission Success Toast */}
      {submissionFeedback && (
        <div className="p-4 bg-emerald-950/70 border border-emerald-800/80 rounded-xl flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{submissionFeedback.message}</span>
          </div>
          <span className="font-mono text-emerald-400">ID: {submissionFeedback.id}</span>
        </div>
      )}

      {errors.form && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/80 rounded-xl flex items-center gap-2 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errors.form}</span>
        </div>
      )}

      {/* Multi-Section Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION A: CAMPAIGN INFORMATION */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <div className="p-1.5 bg-slate-800 rounded-lg text-emerald-400 border border-slate-700">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Section A: Campaign Information
              </h2>
              <p className="text-xs text-slate-400">
                Basic classification descriptors and geographic market
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Campaign Name <span className="text-rose-400">*</span></span>
                <span className="text-[11px] text-slate-500 font-normal">Min 3 characters</span>
              </label>
              <input
                type="text"
                required
                value={formData.campaignName}
                onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                placeholder="e.g. NextGen Decentralized Micro-Lending Terminal"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {errors.campaignName && (
                <p className="text-[11px] text-rose-400">{errors.campaignName}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Primary Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as CampaignCategory | '' })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="">Select campaign category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-[11px] text-rose-400">{errors.category}</p>
              )}
              <p className="text-[11px] text-slate-500">Encoded as categorical feature in pipeline.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Target Country <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="">Select country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-[11px] text-rose-400">{errors.country}</p>
              )}
              <p className="text-[11px] text-slate-500">Market jurisdiction for currency baseline.</p>
            </div>
          </div>
        </div>

        {/* SECTION B: FUNDING DETAILS */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <div className="p-1.5 bg-slate-800 rounded-lg text-sky-400 border border-slate-700">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Section B: Funding & Duration Details
              </h2>
              <p className="text-xs text-slate-400">
                Financial parameters driving target regression and difficulty index
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Funding Goal (USD) <span className="text-rose-400">*</span></span>
                <span className="text-[11px] text-slate-500 font-mono">Target Capital</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-mono">$</span>
                <input
                  type="number"
                  min="1"
                  step="100"
                  required
                  placeholder="e.g. 25000"
                  value={formData.fundingGoal}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fundingGoal: e.target.value === '' ? '' : Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                />
              </div>
              {errors.fundingGoal && (
                <p className="text-[11px] text-rose-400">{errors.fundingGoal}</p>
              )}
              <p className="text-[11px] text-slate-500">Scaled using RobustScaler due to financial skew.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Campaign Duration (Days) <span className="text-rose-400">*</span></span>
                <span className="text-[11px] text-slate-500 font-mono">1 – 90 Days</span>
              </label>
              <input
                type="number"
                min="1"
                max="90"
                required
                placeholder="e.g. 30"
                value={formData.campaignDuration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    campaignDuration: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
              {errors.campaignDuration && (
                <p className="text-[11px] text-rose-400">{errors.campaignDuration}</p>
              )}
              <p className="text-[11px] text-slate-500">
                Feature interaction: Goal-per-day = {formData.fundingGoal && formData.campaignDuration ? `$${(Number(formData.fundingGoal) / (Number(formData.campaignDuration) || 1)).toFixed(0)}/day` : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION C: CREATOR INFORMATION */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <div className="p-1.5 bg-slate-800 rounded-lg text-indigo-400 border border-slate-700">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Section C: Creator Credibility & History
              </h2>
              <p className="text-xs text-slate-400">
                Prior track record features that heavily weight Random Forest & XGBoost splits
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Creator Experience Level <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.creatorExperience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    creatorExperience: e.target.value as any,
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="">Select creator experience</option>
                <option value="First-time">First-time Campaigner</option>
                <option value="1-2 Prior Campaigns">1–2 Prior Campaigns</option>
                <option value="3+ Prior Campaigns">3+ Prior Campaigns</option>
                <option value="Serial Crowdfunder">Serial Crowdfunder (5+)</option>
              </select>
              {errors.creatorExperience && (
                <p className="text-[11px] text-rose-400">{errors.creatorExperience}</p>
              )}
              <p className="text-[11px] text-slate-500">Correlates with backer trust metrics.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Previous Campaign Count
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={formData.previousCampaignCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    previousCampaignCount: e.target.value === '' ? '' : Math.max(0, Number(e.target.value)),
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
              {errors.previousCampaignCount && (
                <p className="text-[11px] text-rose-400">{errors.previousCampaignCount}</p>
              )}
              <p className="text-[11px] text-slate-500">Discrete count feature.</p>
            </div>
          </div>
        </div>

        {/* SECTION D: ENGAGEMENT INFORMATION */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <div className="p-1.5 bg-slate-800 rounded-lg text-amber-400 border border-slate-700">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Section D: Engagement & Pre-Launch Collateral
              </h2>
              <p className="text-xs text-slate-400">
                Signals of initial community engagement and media readiness
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Pre-Launch Subscribers/Followers
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={formData.preLaunchFollowers}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preLaunchFollowers: e.target.value === '' ? '' : Math.max(0, Number(e.target.value)),
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
              {errors.preLaunchFollowers && (
                <p className="text-[11px] text-rose-400">{errors.preLaunchFollowers}</p>
              )}
              <p className="text-[11px] text-slate-500">Day-1 momentum predictor.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Reward Tiers Count
              </label>
              <input
                type="number"
                min="1"
                max="25"
                placeholder="e.g. 4"
                value={formData.rewardTierCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rewardTierCount: e.target.value === '' ? '' : Math.max(1, Number(e.target.value)),
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
              {errors.rewardTierCount && (
                <p className="text-[11px] text-rose-400">{errors.rewardTierCount}</p>
              )}
              <p className="text-[11px] text-slate-500">Product breadth indicator.</p>
            </div>

            <div className="space-y-1 flex flex-col justify-center pt-2">
              <label className="text-xs font-medium text-slate-300 mb-1">
                Campaign Video Collateral
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.hasVideo}
                  onChange={(e) => setFormData({ ...formData, hasVideo: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0 w-4 h-4"
                />
                Has Promotional Video
              </label>
              <p className="text-[11px] text-slate-500 mt-1">Binary feature (has_video = 1/0).</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Academic Note:</span> Dispatches to <code>predictionService.predictCampaign()</code>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Dispatching to ML Pipeline...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Predict Campaign Success
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
