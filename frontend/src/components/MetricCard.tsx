import React from 'react';
import { LucideIcon, HelpCircle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number | null;
  subtitle?: string;
  icon: LucideIcon;
  statusText?: string;
  tooltip?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  statusText,
  tooltip,
}) => {
  const isAwaiting = value === null || value === undefined;

  return (
    <div className="relative p-5 bg-slate-900/70 border border-slate-800 rounded-xl transition-all hover:border-slate-700/80">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className="p-2 bg-slate-800/80 rounded-lg text-slate-300 border border-slate-700/50">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3">
        {isAwaiting ? (
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-amber-400/90 font-mono">
              Awaiting real data
            </span>
          </div>
        ) : (
          <span className="text-2xl font-bold tracking-tight text-slate-100 font-mono">
            {value}
          </span>
        )}
      </div>

      {(subtitle || statusText) && (
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
          <span className="truncate">{subtitle || 'Awaiting database connection'}</span>
          {statusText && (
            <span className="text-[11px] font-medium text-amber-400/90 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
              {statusText}
            </span>
          )}
        </div>
      )}

      {tooltip && (
        <div className="absolute top-3 right-12 group cursor-help">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          <div className="hidden group-hover:block absolute right-0 top-5 z-20 w-48 p-2 text-[11px] bg-slate-950 text-slate-300 border border-slate-700 rounded shadow-lg">
            {tooltip}
          </div>
        </div>
      )}
    </div>
  );
};
