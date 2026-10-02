import React from 'react';
import { useRouter } from '../context/RouterContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { AlertCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentPath } = useRouter();

  const isPublicRoute =
    currentPath === '/' || currentPath === '/login' || currentPath === '/register';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      <Navbar />

      {/* Subtle Academic Integrity Banner for App Views */}
      {!isPublicRoute && (
        <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">
              <strong>Academic ML Mode:</strong> Stage 1 Foundation active. ML models & database show authentic empty/pending states until real Python pipeline & MySQL are connected.
            </span>
          </div>
        </div>
      )}

      {isPublicRoute ? (
        <main className="flex-1">{children}</main>
      ) : (
        <div className="flex-1 flex w-full">
          <Sidebar />
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 bg-slate-950/40 overflow-y-auto">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      )}
    </div>
  );
};
