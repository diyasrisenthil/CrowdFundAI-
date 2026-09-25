import React from 'react';
import { useRouter } from '../context/RouterContext';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  BarChart3,
  Cpu,
  Settings,
  Database,
  Server,
  Terminal,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentPath, navigate } = useRouter();

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      description: 'System KPIs & Overview',
    },
    {
      label: 'New Prediction',
      path: '/prediction/new',
      icon: PlusCircle,
      description: 'Run ML Campaign Analysis',
    },
    {
      label: 'Prediction History',
      path: '/history',
      icon: History,
      description: 'Campaign Records & Audit',
    },
    {
      label: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
      description: 'Decision-Support Trends',
    },
    {
      label: 'Model Performance',
      path: '/model-performance',
      icon: Cpu,
      description: 'Evaluation & Benchmarks',
    },
    {
      label: 'Settings & Gateway',
      path: '/settings',
      icon: Settings,
      description: 'ML Service & DB Config',
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-950/60 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        
        {/* Navigation Group */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Decision-Support Modules
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPath === item.path ||
                (item.path === '/prediction/new' && currentPath.startsWith('/prediction/'));

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-emerald-400 border border-slate-800 font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs truncate font-medium">{item.label}</div>
                    <div className="text-[10px] text-slate-400 truncate">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Academic Stack Indicator */}
        <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2.5">
          <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target ML & DB Specs</span>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Server className="w-3 h-3 text-sky-400" />
                Python Backend:
              </span>
              <span className="font-mono text-slate-400">FastAPI</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-indigo-400" />
                ML Algorithms:
              </span>
              <span className="font-mono text-slate-400">XGBoost / RF</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                Database:
              </span>
              <span className="font-mono text-slate-400">MySQL 8.0</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center justify-between text-slate-400">
          <span>Version: Stage 1 (Arch)</span>
          <span className="text-emerald-400 font-medium">B.Tech Ready</span>
        </div>
        <div className="mt-1 text-slate-400">
          Academic Crowdfunding Predictor
        </div>
      </div>
    </aside>
  );
};
