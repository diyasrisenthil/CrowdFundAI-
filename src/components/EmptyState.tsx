import React from 'react';
import { LucideIcon, Info } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  badgeText?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Info,
  actionLabel,
  onAction,
  badgeText,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl">
      {badgeText && (
        <span className="mb-3 px-2.5 py-0.5 text-xs font-semibold text-amber-300 bg-amber-950/70 border border-amber-800/80 rounded-full">
          {badgeText}
        </span>
      )}
      <div className="p-3 mb-3 bg-slate-800/80 text-slate-400 rounded-full border border-slate-700/60">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-slate-200">{title}</h4>
      <p className="mt-1 max-w-md text-sm text-slate-400 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 px-4 py-2 text-xs font-medium text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
