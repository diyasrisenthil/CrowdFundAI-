import React, { useState } from 'react';
import { apiClient } from '../services/apiClient';
import { StatusBadge } from '../components/StatusBadge';
import {
  Settings,
  Server,
  Database,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Link,
  Shield,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [mlApiUrl, setMlApiUrl] = useState(apiClient.getBaseUrl());
  const [mysqlHost, setMysqlHost] = useState('localhost');
  const [mysqlPort, setMysqlPort] = useState('3306');
  const [mysqlDb, setMysqlDb] = useState('crowdfundai_db');
  
  const [isChecking, setIsChecking] = useState(false);
  const [mlStatus, setMlStatus] = useState<{
    tested: boolean;
    connected: boolean;
    message: string;
  }>({
    tested: false,
    connected: false,
    message: 'Default local endpoint configured. Click "Test Connection" to ping.',
  });

  const handleTestMlConnection = async () => {
    setIsChecking(true);
    apiClient.setBaseUrl(mlApiUrl);
    try {
      const res = await apiClient.checkHealth();
      setMlStatus({
        tested: true,
        connected: res.connected,
        message: res.connected
          ? 'Python FastAPI ML service connected successfully!'
          : `Service not reachable at ${mlApiUrl}. Ensure your Python FastAPI server is running.`,
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            System & Infrastructure
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-xs text-slate-400">API Gateway & DB Config</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          Settings & Environment Integration
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure external endpoints for the Python ML inference microservice and MySQL database.
        </p>
      </div>

      {/* 1. Python ML Service Gateway */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-slate-800 rounded-lg text-sky-400 border border-slate-700">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Python ML Inference Microservice (FastAPI / Flask)
              </h2>
              <p className="text-xs text-slate-400">
                Target endpoint for <code>predictCampaign()</code> and SHAP attributions
              </p>
            </div>
          </div>
          <StatusBadge
            label={mlStatus.connected ? 'Connected' : 'Stage 1 Standby'}
            variant={mlStatus.connected ? 'success' : 'neutral'}
            size="sm"
          />
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              FastAPI Service Base URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={mlApiUrl}
                onChange={(e) => setMlApiUrl(e.target.value)}
                placeholder="http://localhost:8000/api"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="button"
                onClick={handleTestMlConnection}
                disabled={isChecking}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                Test Ping
              </button>
            </div>
          </div>

          <div
            className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
              mlStatus.connected
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            {mlStatus.connected ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
            )}
            <span>{mlStatus.message}</span>
          </div>
        </div>
      </div>

      {/* 2. MySQL Database Connection Parameters */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-slate-800 rounded-lg text-emerald-400 border border-slate-700">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                MySQL Relational Database Parameters
              </h2>
              <p className="text-xs text-slate-400">
                Persistence target for Users, Campaigns, Performance, Predictions & Recommendations
              </p>
            </div>
          </div>
          <StatusBadge label="Schema DDL Ready" variant="info" size="sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Host</label>
            <input
              type="text"
              value={mysqlHost}
              onChange={(e) => setMysqlHost(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Port</label>
            <input
              type="text"
              value={mysqlPort}
              onChange={(e) => setMysqlPort(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Database Name</label>
            <input
              type="text"
              value={mysqlDb}
              onChange={(e) => setMysqlDb(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
            />
          </div>
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Schema File Reference:</span> The full DDL script is located at <code>src/db/schema.sql</code>. It includes primary keys, foreign key constraints, and performance indexes.
        </div>
      </div>

      {/* 3. ML Model Registry & Versioning */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <div className="p-1.5 bg-slate-800 rounded-lg text-indigo-400 border border-slate-700">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Active Model Registry & Version Tracking
            </h2>
            <p className="text-xs text-slate-400">
              Model lifecycle configuration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
            <div className="text-slate-500 font-medium">Active Classification Registry</div>
            <div className="font-mono text-emerald-400 font-semibold">
              candidate_pool (LogisticRegression, RandomForest, XGBoost)
            </div>
            <div className="text-[11px] text-slate-400">Selection: Empirical Test-Split</div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
            <div className="text-slate-500 font-medium">Explainability Method</div>
            <div className="font-mono text-sky-400 font-semibold">
              TreeSHAP / KernelSHAP
            </div>
            <div className="text-[11px] text-slate-400">Baseline: E[f(X)] expected value</div>
          </div>
        </div>
      </div>

    </div>
  );
};
