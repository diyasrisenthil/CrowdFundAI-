import React from 'react';
import { ModelComparisonItem } from '../types';
import { StatusBadge } from './StatusBadge';
import { HelpCircle } from 'lucide-react';

interface ModelComparisonProps {
  title: string;
  subtitle: string;
  models: ModelComparisonItem[];
  metricKeys: string[];
}

export const ModelComparisonTable: React.FC<ModelComparisonProps> = ({
  title,
  subtitle,
  models,
  metricKeys,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Empirical selection based on validation set</span>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-800 rounded-lg">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4 font-medium">Model Algorithm</th>
              <th className="py-3 px-4 font-medium">Training Status</th>
              {metricKeys.map((metric) => (
                <th key={metric} className="py-3 px-4 font-medium font-mono">
                  {metric}
                </th>
              ))}
              <th className="py-3 px-4 font-medium">Selected Best</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono">
            {models.map((model) => (
              <tr key={model.modelName} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4 font-sans font-medium text-slate-200">
                  {model.modelName}
                </td>
                <td className="py-3.5 px-4 font-sans">
                  <StatusBadge
                    label={model.status === 'Not Trained' ? 'Model Not Trained' : model.status}
                    variant={model.status === 'Trained' ? 'success' : 'neutral'}
                    size="sm"
                  />
                </td>
                {metricKeys.map((metric) => {
                  const val = model.metrics[metric];
                  return (
                    <td key={metric} className="py-3.5 px-4 text-slate-400">
                      {val !== null && val !== undefined ? val.toFixed(4) : '—'}
                    </td>
                  );
                })}
                <td className="py-3.5 px-4 font-sans">
                  {model.selectedAsBest ? (
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                      Selected Model
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">Pending evaluation</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg text-[11px] text-slate-400">
        <span className="font-semibold text-slate-300">Viva Defense Note:</span> Candidate models will be evaluated using 5-fold cross-validation once the dataset is imported. The final selected model will be determined strictly from empirical evaluation results, not predetermined assumptions.
      </div>
    </div>
  );
};
