import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewPredictionPage } from './pages/NewPredictionPage';
import { PredictionResultPage } from './pages/PredictionResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { SettingsPage } from './pages/SettingsPage';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const RouteRenderer: React.FC = () => {
  const { currentPath, navigate } = useRouter();

  // Public Routes
  if (currentPath === '/') return <LandingPage />;
  if (currentPath === '/login') return <LoginPage />;
  if (currentPath === '/register') return <RegisterPage />;

  // Application Routes
  if (currentPath === '/dashboard') return <DashboardPage />;
  if (currentPath === '/prediction/new') return <NewPredictionPage />;
  if (currentPath.startsWith('/prediction/')) return <PredictionResultPage />;
  if (currentPath === '/history') return <HistoryPage />;
  if (currentPath === '/analytics') return <AnalyticsPage />;
  if (currentPath === '/model-performance') return <ModelPerformancePage />;
  if (currentPath === '/settings') return <SettingsPage />;

  // 404 Fallback
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-full text-amber-400">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-slate-100">Page Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm">
        The requested path <code className="text-emerald-400">{currentPath}</code> does not match any registered CrowdFundAI+ module route.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Return to Dashboard
      </button>
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <Layout>
        <RouteRenderer />
      </Layout>
    </RouterProvider>
  );
}
