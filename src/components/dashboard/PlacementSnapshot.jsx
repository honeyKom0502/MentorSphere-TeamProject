import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, Award, Building2, Briefcase, CheckCircle2 } from 'lucide-react';
import { PLACEMENT_STATS } from '../../data/mockData';

export const PlacementSnapshot = ({ onExplorePlacements }) => {
  return (
    <div className="p-6 rounded-3xl glass-panel bg-slate-900/50 light:bg-white/80 border border-slate-800/80 light:border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-slate-100 light:text-slate-900 flex items-center gap-2">
            <span>Placement Intelligence Snapshot</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
              2026 Batch Active
            </span>
          </h3>
          <p className="text-xs text-slate-400">Verified college hiring insights and compensation distribution</p>
        </div>

        <button
          onClick={onExplorePlacements}
          className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
        >
          Detailed Analytics
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="p-3.5 rounded-2xl bg-slate-950/60 light:bg-slate-50 border border-slate-800 light:border-slate-200">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Award className="w-3.5 h-3.5 text-orange-400" />
            <span>Highest Package</span>
          </div>
          <span className="font-display font-black text-xl text-orange-400">
            {PLACEMENT_STATS.highestPackage}
          </span>
          <span className="text-[10px] text-slate-500 block truncate">Atlassian & Google</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/60 light:bg-slate-50 border border-slate-800 light:border-slate-200">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>Average Package</span>
          </div>
          <span className="font-display font-black text-xl text-blue-400">
            {PLACEMENT_STATS.averagePackage}
          </span>
          <span className="text-[10px] text-slate-500 block truncate">+14% YoY Growth</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/60 light:bg-slate-50 border border-slate-800 light:border-slate-200">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Placement Rate</span>
          </div>
          <span className="font-display font-black text-xl text-emerald-400">
            {PLACEMENT_STATS.placementPercentage}
          </span>
          <span className="text-[10px] text-slate-500 block truncate">684 Offers Released</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/60 light:bg-slate-50 border border-slate-800 light:border-slate-200">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Building2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Companies Visited</span>
          </div>
          <span className="font-display font-black text-xl text-purple-400">
            {PLACEMENT_STATS.companiesVisited}+
          </span>
          <span className="text-[10px] text-slate-500 block truncate">148 Tier-1 Tech Offers</span>
        </div>
      </div>

      {/* Top Recruiters Marquee style list */}
      <div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Top Tech Companies Recruiting On-Campus:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {PLACEMENT_STATS.topCompanies.slice(0, 6).map(company => (
            <div
              key={company.name}
              className="px-3 py-2 rounded-xl bg-slate-950/80 light:bg-slate-50 border border-slate-800 light:border-slate-200 shrink-0 flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                {company.name[0]}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 light:text-slate-800 block">
                  {company.name}
                </span>
                <span className="text-[10px] text-slate-500 block font-mono">
                  {company.avgCTC}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
