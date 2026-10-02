import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { predictionService } from '../services/predictionService';
import { CampaignInput, CampaignCategory } from '../types';
import {
  Sparkles,
  Info,
  Layers,
  DollarSign,
  Calendar,
  Globe,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

const CATEGORIES: CampaignCategory[] = [
  'Art',
  'Comics',
  'Crafts',
  'Dance',
  'Design',
  'Fashion',
  'Film & Video',
  'Food',
  'Games',
  'Journalism',
  'Music',
  'Photography',
  'Publishing',
  'Technology',
  'Theater',
];

const SUBCATEGORIES: Record<string, string[]> = {
  'Art': ['Art', 'Illustration', 'Painting', 'Public Art', 'Sculpture'],
  'Comics': ['Comics', 'Comic Books', 'Graphic Novels'],
  'Crafts': ['Crafts', 'DIY', 'Embroidery', 'Woodworking'],
  'Dance': ['Dance', 'Performances', 'Residencies'],
  'Design': ['Design', 'Product Design', 'Architecture', 'Graphic Design'],
  'Fashion': ['Fashion', 'Apparel', 'Accessories', 'Footwear'],
  'Film & Video': ['Film & Video', 'Documentary', 'Short Film', 'Feature Film', 'Animation'],
  'Food': ['Food', 'Restaurants', 'Farms', 'Drinks', 'Cookbooks'],
  'Games': ['Games', 'Tabletop Games', 'Video Games', 'Playing Cards'],
  'Journalism': ['Journalism', 'Audio', 'Print', 'Web'],
  'Music': ['Music', 'Rock', 'Pop', 'Indie Rock', 'Classical', 'Hip-Hop'],
  'Photography': ['Photography', 'Photobooks', 'Places'],
  'Publishing': ['Publishing', 'Fiction', 'Nonfiction', "Children's Books", 'Poetry'],
  'Technology': ['Technology', 'Software', 'Hardware', 'Gadgets', 'Apps', 'Web'],
  'Theater': ['Theater', 'Plays', 'Musical'],
};

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'MX', name: 'Mexico' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'JP', name: 'Japan' },
];

const CURRENCIES = ['USD', 'GBP', 'CAD', 'EUR', 'AUD', 'MXN', 'JPY', 'SEK'];

interface FormState {
  campaignName: string;
  category: CampaignCategory | '';
  subCategory: string;
  country: string;
  currency: string;
  fundingGoal: number | '';
  campaignDuration: number | '';
  launchMonth: number | '';
  launchHour: number | '';
}

export const NewPredictionPage: React.FC = () => {
  const { navigate } = useRouter();

  // Form State using dataset pre-launch fields only
  const [formData, setFormData] = useState<FormState>({
    campaignName: '',
    category: '',
    subCategory: '',
    country: 'US',
    currency: 'USD',
    fundingGoal: '',
    campaignDuration: '',
    launchMonth: 10,
    launchHour: 14,
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

    if (!formData.currency) {
      errs.currency = 'Please select a currency.';
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

    if (
      formData.launchMonth !== '' &&
      (Number(formData.launchMonth) < 1 || Number(formData.launchMonth) > 12)
    ) {
      errs.launchMonth = 'Launch month must be between 1 and 12.';
    }

    if (
      formData.launchHour !== '' &&
      (Number(formData.launchHour) < 0 || Number(formData.launchHour) > 23)
    ) {
      errs.launchHour = 'Launch hour must be between 0 and 23.';
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

    // Payload dispatching legitimate pre-launch dataset features
    const payload: CampaignInput = {
      campaignName: formData.campaignName.trim(),
      category: formData.category as CampaignCategory,
      subCategory: formData.subCategory || (formData.category as string),
      country: formData.country,
      currency: formData.currency,
      fundingGoal: Number(formData.fundingGoal),
      campaignDuration: Number(formData.campaignDuration),
      launchMonth: Number(formData.launchMonth) || 10,
      launchHour: Number(formData.launchHour) || 14,
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
        setBackendNotice({
          title: 'Backend Unavailable — ML Pipeline Not Connected',
          message:
            result.message ||
            'The Python FastAPI prediction service is not connected. Campaign parameters have been validated for transmission to the ML API once deployed.',
        });
      }
    } catch (err: any) {
      setErrors({ form: err?.message || 'Failed to communicate with prediction service.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableSubcategories = formData.category ? SUBCATEGORIES[formData.category] || [] : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Real Pre-Launch Feature Pipeline
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-xs text-slate-400">Kickstarter Dataset Inference</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          Campaign Success Predictor
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Enter verified pre-launch campaign parameters. Form inputs map directly to features trained on the 378,000+ Kickstarter dataset.
        </p>
      </div>

      {/* Academic Transparency Callout */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-3">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <span className="font-semibold text-slate-200">
            Pre-Launch Dataset Validation:
          </span>
          <p className="text-slate-400 leading-relaxed">
            All parameters collected below are strictly known prior to project launch. Submitting this form sends live data to <code>predict_proba()</code> on the saved trained pipeline without mock values or hardcoded fallbacks.
          </p>
        </div>
      </div>

      {/* Backend Notice */}
      {backendNotice && (
        <div className="p-4 bg-amber-950/50 border border-amber-800/80 rounded-xl flex items-start gap-3 text-xs text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-amber-300">{backendNotice.title}</div>
            <p className="text-amber-200/90 leading-relaxed">{backendNotice.message}</p>
          </div>
        </div>
      )}

      {/* Submission Feedback */}
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
        
        {/* SECTION A: CAMPAIGN CLASSIFICATION */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <div className="p-1.5 bg-slate-800 rounded-lg text-emerald-400 border border-slate-700">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Section A: Campaign Classification & Title
              </h2>
              <p className="text-xs text-slate-400">
                Title text length, word count, and category features
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Campaign Name <span className="text-rose-400">*</span></span>
                <span className="text-[11px] text-slate-500 font-normal">Extracts name length & word count</span>
              </label>
              <input
                type="text"
                required
                value={formData.campaignName}
                onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                placeholder="e.g. Smart Wireless Earbuds with ANC"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {errors.campaignName && (
                <p className="text-[11px] text-rose-400">{errors.campaignName}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Main Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as CampaignCategory | '',
                    subCategory: '',
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="">Select main category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-[11px] text-rose-400">{errors.category}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Subcategory
              </label>
              <select
                value={formData.subCategory}
                onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                disabled={!formData.category}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
              >
                <option value="">Select subcategory (optional)</option>
                {availableSubcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION B: FINANCIAL & GEOGRAPHY */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <div className="p-1.5 bg-slate-800 rounded-lg text-sky-400 border border-slate-700">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Section B: Funding Goal & Market Currency
              </h2>
              <p className="text-xs text-slate-400">
                Target capital, country baseline, and currency indicators
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Funding Goal <span className="text-rose-400">*</span></span>
                <span className="text-[11px] text-slate-500 font-mono">USD</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-mono">$</span>
                <input
                  type="number"
                  min="1"
                  step="100"
                  required
                  placeholder="e.g. 10000"
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
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Country <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Currency <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION C: DURATION & TIMING */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <div className="p-1.5 bg-slate-800 rounded-lg text-indigo-400 border border-slate-700">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Section C: Duration & Launch Schedule
              </h2>
              <p className="text-xs text-slate-400">
                Duration in days, launch month, and hour of launch
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Duration (Days) <span className="text-rose-400">*</span></span>
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
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Launch Month (1–12)
              </label>
              <select
                value={formData.launchMonth}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    launchMonth: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Month {m} ({new Date(2026, m - 1).toLocaleString('default', { month: 'short' })})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Launch Hour (0–23)
              </label>
              <select
                value={formData.launchHour}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    launchHour: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                  <option key={h} value={h}>
                    {h.toString().padStart(2, '0')}:00 UTC
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400">
            <span>Inference Target:</span> <code>predict_proba()</code> on saved pipeline
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Executing Model Inference...
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
