import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Award, 
  Building2, 
  CheckCircle2, 
  Briefcase, 
  FileText, 
  Sparkles,
  ArrowRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { PLACEMENT_STATS } from '../../data/mockData';

export const PlacementAnalytics = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-elevated bg-slate-950/80 light:bg-white/90 border border-slate-800 light:border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Campus Hiring & Career Intelligence</span>
            </div>
            <h2 className="font-display font-black text-2xl md:text-3xl text-slate-100 light:text-slate-900 tracking-tight">
              Placement Command Center
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
              Transparent, verified campus hiring records, company compensation packages, past interview questions, and senior placement debriefs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {['overview', 'companies', 'roadmap'].map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-xl capitalize transition-all ${
                  selectedTab === tab
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white light:bg-slate-100 light:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Big Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl glass-panel bg-slate-900/60 light:bg-white/80 border border-slate-800/80 light:border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Highest Package</span>
            <Award className="w-5 h-5 text-orange-400" />
          </div>
          <div className="font-display font-black text-3xl text-orange-400">
            {PLACEMENT_STATS.highestPackage}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Offered by Atlassian & Google</p>
        </div>

        <div className="p-5 rounded-3xl glass-panel bg-slate-900/60 light:bg-white/80 border border-slate-800/80 light:border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Average Package</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="font-display font-black text-3xl text-blue-400">
            {PLACEMENT_STATS.averagePackage}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">↑ +14.2% from previous year</p>
        </div>

        <div className="p-5 rounded-3xl glass-panel bg-slate-900/60 light:bg-white/80 border border-slate-800/80 light:border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Placement Rate</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="font-display font-black text-3xl text-emerald-400">
            {PLACEMENT_STATS.placementPercentage}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">{PLACEMENT_STATS.totalOffers} Total Offers Released</p>
        </div>

        <div className="p-5 rounded-3xl glass-panel bg-slate-900/60 light:bg-white/80 border border-slate-800/80 light:border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Companies Visited</span>
            <Building2 className="w-5 h-5 text-purple-400" />
          </div>
          <div className="font-display font-black text-3xl text-purple-400">
            {PLACEMENT_STATS.companiesVisited}+
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">148 Dream / Super-Dream CTC</p>
        </div>
      </div>

      {/* OVERVIEW TAB: Trends & Companies */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Year-over-Year CTC Trends */}
          <div className="lg:col-span-2 p-6 rounded-3xl glass-panel bg-slate-900/50 light:bg-white/80 border border-slate-800/80 light:border-slate-200">
            <h3 className="font-display font-bold text-base text-slate-100 light:text-slate-900 mb-1">
              4-Year CTC Growth & Placement Momentum
            </h3>
            <p className="text-xs text-slate-400 mb-6">Average package and highest CTC trajectory</p>

            <div className="space-y-4">
              {PLACEMENT_STATS.trends.map((item) => (
                <div key={item.year} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 light:text-slate-800">{item.year}</span>
                    <div className="flex items-center gap-3 text-slate-400">
                      <span>Avg: <strong className="text-blue-400">{item.avg} LPA</strong></span>
                      <span>Highest: <strong className="text-orange-400">{item.highest} LPA</strong></span>
                      <span>Placed: <strong className="text-slate-200 light:text-slate-800">{item.placed}</strong></span>
                    </div>
                  </div>

                  <div className="h-3 rounded-full bg-slate-800/80 light:bg-slate-200 overflow-hidden flex">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
                      style={{ width: `${(item.avg / 50) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Senior Placement Insights */}
          <div className="p-6 rounded-3xl glass-panel bg-slate-900/50 light:bg-white/80 border border-slate-800/80 light:border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <h3 className="font-display font-bold text-base text-slate-100 light:text-slate-900">
                Senior Placement Rules
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-300 light:text-slate-600">
              <div className="p-3 rounded-2xl bg-slate-950/60 light:bg-slate-50 border border-slate-800 light:border-slate-200">
                <span className="font-bold text-blue-400 block mb-1">1. Master 75 Core LeetCode Patterns</span>
                Don't solve 500 random problems. Focus on Blind 75 / Striver SDE sheet patterns (Sliding Window, Two Pointers, Trees, Graphs).
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 light:bg-slate-50 border border-slate-800 light:border-slate-200">
                <span className="font-bold text-orange-400 block mb-1">2. One Production-Grade Project</span>
                A deployed full-stack project with auth, database indexing, and caching beats 5 clone projects every single time.
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 light:bg-slate-50 border border-slate-800 light:border-slate-200">
                <span className="font-bold text-emerald-400 block mb-1">3. Mock Interviews in 3rd Year</span>
                Schedule mock technical interviews with seniors in the MentorSphere directory to eliminate interview anxiety.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPANIES TAB */}
      {(selectedTab === 'companies' || selectedTab === 'overview') && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-slate-100 light:text-slate-900">
              Top Recruiting Companies & Package Breakdowns
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLACEMENT_STATS.topCompanies.map((c) => (
              <div
                key={c.name}
                className="p-5 rounded-3xl glass-panel bg-slate-900/60 light:bg-white/80 border border-slate-800/80 light:border-slate-200 hover:border-blue-500/40 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-white font-display font-bold text-lg flex items-center justify-center shadow-md">
                    {c.name[0]}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                    {c.hires} Hires
                  </span>
                </div>

                <h4 className="font-display font-bold text-base text-slate-100 light:text-slate-900">
                  {c.name}
                </h4>
                <p className="text-xs text-orange-400 font-bold font-mono mt-0.5">
                  {c.avgCTC}
                </p>
                <p className="text-xs text-slate-400 light:text-slate-600 mt-2 line-clamp-2">
                  Role: {c.roles}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ROADMAP TAB */}
      {selectedTab === 'roadmap' && (
        <div className="p-6 md:p-8 rounded-3xl glass-panel bg-slate-900/50 light:bg-white/80 border border-slate-800/80 light:border-slate-200 space-y-6">
          <h3 className="font-display font-black text-xl text-slate-100 light:text-slate-900">
            4-Year Engineering Placement Roadmap
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { year: '1st Year', focus: 'Foundations & Exploration', tasks: ['Pick 1 Language (C++/Java/Python)', 'Learn basic DSA (Arrays, Strings, Recursion)', 'Build basic web projects', 'Maintain 8.0+ CGPA'] },
              { year: '2nd Year', focus: 'DSA Mastery & Core CS', tasks: ['Trees, Graphs, DP on LeetCode', 'Learn OS, DBMS, Computer Networks', 'Join hackathons & build full-stack app', 'Prepare for 3rd year summer internship'] },
              { year: '3rd Year', focus: 'Internships & System Design', tasks: ['Summer Internship OAs (Aug-Oct)', 'Learn System Design fundamentals', '200+ LeetCode problems solved', 'Start mock interviews with seniors'] },
              { year: '4th Year', focus: 'Campus Drives & Off-Campus', tasks: ['On-Campus placement drives (July-Nov)', 'Target off-campus referrals through alumni', 'Resume reviews & HR behavioral rounds', 'Negotiate offers & start careers'] }
            ].map(r => (
              <div key={r.year} className="p-4 rounded-2xl bg-slate-950/60 light:bg-slate-50 border border-slate-800 light:border-slate-200 space-y-2">
                <span className="text-xs font-bold text-orange-400 block uppercase tracking-wider">{r.year}</span>
                <h4 className="font-display font-bold text-sm text-slate-200 light:text-slate-800">{r.focus}</h4>
                <ul className="space-y-1.5 pt-2">
                  {r.tasks.map(t => (
                    <li key={t} className="text-xs text-slate-400 light:text-slate-600 flex items-start gap-1.5">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
