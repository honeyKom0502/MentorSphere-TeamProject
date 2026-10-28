import React from 'react';
import { Sparkles, Shield, Heart, Globe, MessageSquare, Share2 } from 'lucide-react';

export const CinematicFooter = ({ onOpenLogin, onOpenSignup }) => {
  return (
    <footer className="border-t border-slate-800/80 light:border-slate-200 bg-slate-950/90 light:bg-slate-50/95 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display font-black text-lg text-slate-100 light:text-slate-900 tracking-tight">
              Mentor<span className="text-orange-500">Sphere</span>
            </span>
            <p className="text-xs text-slate-400">Engineering College Mentorship & Knowledge Network</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400">
          <a href="#the-gap" className="hover:text-slate-200 light:hover:text-slate-900 transition-colors">The Problem</a>
          <a href="#channels" className="hover:text-slate-200 light:hover:text-slate-900 transition-colors">Topic Channels</a>
          <a href="#privacy" className="hover:text-slate-200 light:hover:text-slate-900 transition-colors">Privacy Architecture</a>
          <button onClick={onOpenLogin} className="hover:text-slate-200 light:hover:text-slate-900 transition-colors">Sign In</button>
          <button onClick={onOpenSignup} className="text-orange-400 hover:text-orange-300 transition-colors">Create Account</button>
        </div>

        {/* Copyright */}
        <div className="text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MentorSphere. Built for engineering students.</p>
          <p className="text-[10px] text-slate-600 mt-0.5">Privacy-First • Anime Identity • AI Moderated</p>
        </div>
      </div>
    </footer>
  );
};
