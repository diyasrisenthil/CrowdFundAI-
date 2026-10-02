import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { authService } from '../services/authService';
import { TrendingUp, BookOpen, User, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { VivaArchitectureModal } from './VivaArchitectureModal';

export const Navbar: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const [isVivaModalOpen, setIsVivaModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentUser = authService.getCurrentUser();
  const isPublicRoute = ['/', '/login', '/register'].includes(currentPath);

  const scrollToSection = (sectionId: string) => {
    if (currentPath !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo & Project Title */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-950 border border-emerald-700/60 text-emerald-400 group-hover:border-emerald-500 transition-colors">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold tracking-tight text-slate-100">
                    CrowdFundAI<span className="text-emerald-400">+</span>
                  </span>
                  <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    B.Tech IT
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  FinTech Crowdfunding ML & Explainable AI
                </p>
              </div>
            </button>

            {/* Navigation Section Links */}
            <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-300">
              <button
                onClick={() => scrollToSection('features')}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                How it works
              </button>
              <button
                onClick={() => scrollToSection('ai-insights')}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                AI Insights
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                About
              </button>
            </nav>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Analyze My Campaign CTA */}
            <button
              onClick={() => navigate('/prediction/new')}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
            >
              Analyze My Campaign
            </button>

            {/* Viva Architecture Guide Button */}
            <button
              onClick={() => setIsVivaModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/80 rounded-lg transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Viva Project Guide</span>
              <span className="sm:hidden">Guide</span>
            </button>

            {isPublicRoute ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    currentPath === '/login'
                      ? 'text-emerald-400 bg-slate-800'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/prediction/new')}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors font-semibold cursor-pointer shadow-sm"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="max-w-[120px] truncate font-medium">{currentUser.name}</span>
                </div>
                <button
                  onClick={() => {
                    authService.logout();
                    navigate('/');
                  }}
                  title="Logout / Exit Session"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 border-t border-slate-800 bg-slate-950 space-y-2">
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  navigate('/prediction/new');
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs text-left font-semibold text-emerald-400 bg-emerald-950/40 rounded border border-emerald-800/60"
              >
                Analyze My Campaign
              </button>
              <button
                onClick={() => {
                  navigate('/prediction/new');
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs text-left text-slate-300 bg-slate-900 rounded border border-slate-800"
              >
                Get Started
              </button>
              <button
                onClick={() => {
                  scrollToSection('features');
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs text-left text-slate-300 bg-slate-900 rounded border border-slate-800"
              >
                Features
              </button>
              <button
                onClick={() => {
                  scrollToSection('how-it-works');
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs text-left text-slate-300 bg-slate-900 rounded border border-slate-800"
              >
                How it works
              </button>
              <button
                onClick={() => {
                  scrollToSection('ai-insights');
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs text-left text-slate-300 bg-slate-900 rounded border border-slate-800"
              >
                AI Insights
              </button>
              <button
                onClick={() => {
                  scrollToSection('about');
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs text-left text-slate-300 bg-slate-900 rounded border border-slate-800"
              >
                About
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Viva Architecture Modal */}
      <VivaArchitectureModal
        isOpen={isVivaModalOpen}
        onClose={() => setIsVivaModalOpen(false)}
      />
    </>
  );
};
