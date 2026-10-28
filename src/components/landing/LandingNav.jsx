import React from 'react';
import { Sun, Moon, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import acharyaLogo from '../../assets/acharya-logo.jpg';

export const LandingNav = ({ onOpenLogin, onOpenSignup }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="fixed top-4 inset-x-4 md:inset-x-8 z-50 max-w-7xl mx-auto">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 rounded-3xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-white/90 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200/90 shadow-xl backdrop-blur-2xl">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-2xl bg-white overflow-hidden flex items-center justify-center shadow-md shadow-blue-500/30 ring-1 ring-slate-200/70 shrink-0">
            <img
              src={acharyaLogo}
              alt="Acharya Institute logo"
              className="w-full h-full object-contain p-0.5"
            />
          </div>
          <div>
            <span className="font-display font-black text-lg tracking-tight text-slate-100 dark:text-slate-100 light:text-slate-900">
              Mentor<span className="text-orange-500 light:text-orange-600">Sphere</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[9px] font-bold text-blue-400 dark:text-blue-400 light:text-blue-700 border border-blue-500/30 light:border-blue-300 px-2 py-0.5 rounded-full uppercase">
              College Network
            </span>
          </div>
        </div>

        {/* Center Nav Links - Dark Text in Light Mode */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-300 dark:text-slate-300 light:text-slate-800">
          <a href="#the-gap" className="hover:text-orange-400 light:hover:text-orange-600 transition-colors">The Problem</a>
          <a href="#the-network" className="hover:text-orange-400 light:hover:text-orange-600 transition-colors">The Network</a>
          <a href="#channels" className="hover:text-orange-400 light:hover:text-orange-600 transition-colors">Channels</a>
          <a href="#placements" className="hover:text-orange-400 light:hover:text-orange-600 transition-colors">Placements</a>
          <a href="#privacy" className="hover:text-orange-400 light:hover:text-orange-600 transition-colors">Privacy Shield</a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-2xl text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-slate-800/50 light:hover:bg-slate-100 transition-colors"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </button>

          <button
            onClick={onOpenLogin}
            className="px-3.5 py-2 text-xs font-bold rounded-xl text-slate-200 dark:text-slate-200 light:text-slate-800 hover:bg-slate-800/60 light:hover:bg-slate-100 transition-colors"
          >
            Sign In
          </button>

          <button
            onClick={onOpenSignup}
            className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};