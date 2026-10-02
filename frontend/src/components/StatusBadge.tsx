import React from 'react';

export type BadgeVariant = 'warning' | 'neutral' | 'info' | 'success' | 'danger';

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'sm',
  pulse = false,
}) => {
  const variantStyles = {
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
    warning: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
    info: 'bg-sky-950/60 text-sky-300 border-sky-800/60',
    success: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    danger: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
  };

  const dotColors = {
    neutral: 'bg-slate-400',
    warning: 'bg-amber-400',
    info: 'bg-sky-400',
    success: 'bg-emerald-400',
    danger: 'bg-rose-400',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant]}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant]}`} />
      </span>
      {label}
    </span>
  );
};
