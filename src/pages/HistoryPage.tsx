import React, { useEffect, useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { predictionService } from '../services/predictionService';
import { PredictionRecord, CampaignCategory } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import {
  History,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Layers,
  PlusCircle,
  Database,
} from 'lucide-react';

const CATEGORIES: ('ALL' | CampaignCategory)[] = [
  'ALL',
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

export const HistoryPage: React.FC = () => {
  const { navigate } = useRouter();
  const [records, setRecords] = useState<PredictionRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isLoading, setIsLoading] = useState(true);

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const data = await predictionService.getPredictionHistory({
        search: searchTerm,
        category: categoryFilter,
        status: statusFilter,
      });

      // Sort
      const sorted = [...data].sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });

      setRecords(sorted);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [searchTerm, categoryFilter, statusFilter, sortOrder]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Audit & Tracking
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Module 1 Persistence</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Prediction History & Campaign Log
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Query and inspect campaign prediction records. Ready to stream stored records from the MySQL database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/prediction/new')}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New Prediction
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-900/60 p-4 border border-slate-800 rounded-xl">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search campaigns or ID..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Layers className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Inference Statuses</option>
            <option value="completed">Completed by ML</option>
            <option value="pending_model">Pending ML Pipeline</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="relative">
          <ArrowUpDown className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* History Table or Empty State */}
      {records.length === 0 ? (
        <EmptyState
          title="No prediction records available yet."
          description="Prediction history will appear here after the real ML prediction service and database are connected."
          icon={Database}
          badgeText="Database Status: Awaiting Connection"
        />
      ) : (
        <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/60">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 font-medium">Campaign</th>
                <th className="py-3.5 px-4 font-medium">Category</th>
                <th className="py-3.5 px-4 font-medium">Prediction Date</th>
                <th className="py-3.5 px-4 font-medium">Success Probability</th>
                <th className="py-3.5 px-4 font-medium">Predicted Funding</th>
                <th className="py-3.5 px-4 font-medium">Status</th>
                <th className="py-3.5 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-semibold text-slate-200">
                      {rec.campaign.campaignName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{rec.id}</div>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-slate-300">
                    {rec.campaign.category}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(rec.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    {rec.successProbability !== null ? (
                      <span className="text-emerald-400 font-semibold">
                        {(rec.successProbability * 100).toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-amber-400/90 font-sans text-[11px]">
                        Awaiting Model
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {rec.predictedFunding !== null ? (
                      <span className="text-sky-400">
                        ${rec.predictedFunding.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-amber-400/90 font-sans text-[11px]">
                        Awaiting Regressor
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <StatusBadge
                      label={rec.status === 'completed' ? 'Evaluated' : 'Pending Model'}
                      variant={rec.status === 'completed' ? 'success' : 'warning'}
                      size="sm"
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <button
                      onClick={() => navigate(`/prediction/${rec.id}`)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
