import React from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Hash, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  GraduationCap, 
  Briefcase,
  Code2,
  Cpu,
  Layers,
  Zap,
  Compass,
  Play
} from 'lucide-react';
import { AnimeAvatar, ANIME_AVATARS } from '../../data/animeAvatars';
import { RoleBadge } from '../common/Badge';
import { CHANNELS_DATA, PLACEMENT_STATS } from '../../data/mockData';

export const ScrollStory = ({ onOpenSignup }) => {
  return (
    <div className="relative space-y-32 py-16 max-w-6xl mx-auto px-4 sm:px-6">
      {/* =========================================================================
          SECTION 1: THE PROBLEM
          ========================================================================= */}
      <section id="the-gap" className="relative">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-2">
            CHAPTER 01 • THE CORE PROBLEM
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-100 light:text-slate-900 tracking-tight leading-tight">
            "The knowledge gap starts in first year."
          </h2>
          <p className="text-sm sm:text-base text-slate-400 light:text-slate-600 mt-4 leading-relaxed">
            In engineering colleges, students enter with high ambitions but quickly face a maze of unanswered questions with almost zero structured access to seniors.
          </p>
        </div>

        {/* 6 Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { q: "Which programming language should I pick first?", sub: "C++ vs Java vs Python for DSA and placement drives" },
            { q: "How do I start DSA without feeling overwhelmed?", sub: "Stuck in tutorial hell without knowing core patterns" },
            { q: "Which projects actually impress tech recruiters?", sub: "Moving beyond basic to-do list clones to production systems" },
            { q: "How did seniors crack 40+ LPA campus drives?", sub: "Which topics were tested in Google, Atlassian & Microsoft OAs" },
            { q: "What fatal mistakes should juniors avoid early?", sub: "CGPA pitfalls, missing internship windows, unpolished resumes" },
            { q: "How do I reach alumni working in tier-1 companies?", sub: "Cold LinkedIn messages with 5% reply rates vs internal college network" }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="p-5 rounded-3xl glass-panel bg-slate-950/60 light:bg-white/80 border border-slate-800/80 light:border-slate-200 shadow-md"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center mb-3">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h4 className="font-display font-bold text-sm text-slate-100 light:text-slate-900 mb-1">
                "{item.q}"
              </h4>
              <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
                {item.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: THE BRIDGE
          ========================================================================= */}
      <section id="the-network" className="relative p-8 md:p-12 rounded-3xl glass-panel-elevated bg-gradient-to-r from-blue-950/40 via-slate-950 to-orange-950/30 border border-slate-800 light:border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-2">
            CHAPTER 02 • THE NETWORK BRIDGE
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-100 light:text-slate-900 tracking-tight">
            Juniors <span className="text-orange-400">→</span> Seniors <span className="text-orange-400">→</span> Alumni
          </h2>
          <p className="text-sm sm:text-base text-slate-400 light:text-slate-600 mt-3 leading-relaxed">
            Connected in a single continuous digital ecosystem. No awkward cold emails, no formal hierarchies.
          </p>
        </div>

        {/* 3 Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 light:bg-slate-50 light:border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto text-xl font-bold">
              👶
            </div>
            <RoleBadge role="Junior" size="md" />
            <h4 className="font-display font-bold text-base text-slate-100 light:text-slate-900">
              1st & 2nd Year Students
            </h4>
            <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
              Ask doubts freely, discover roadmaps early, join topic channels, and avoid common college mistakes.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-orange-500/30 light:bg-slate-50 light:border-slate-200 text-center space-y-3 shadow-lg shadow-orange-500/10">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto text-xl font-bold">
              🎓
            </div>
            <RoleBadge role="Senior" size="md" />
            <h4 className="font-display font-bold text-base text-slate-100 light:text-slate-900">
              3rd & 4th Year Students
            </h4>
            <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
              Share interview questions, give resume reviews, conduct mock interviews, and build leadership impact.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-purple-500/30 light:bg-slate-50 light:border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto text-xl font-bold">
              💼
            </div>
            <RoleBadge role="Alumni" size="md" />
            <h4 className="font-display font-bold text-base text-slate-100 light:text-slate-900">
              Graduated Industry Engineers
            </h4>
            <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
              Give internal company referrals, higher studies (MS/GATE) guidance, and stay connected with your college roots.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: TOPIC CHANNELS
          ========================================================================= */}
      <section id="channels" className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block mb-1">
              CHAPTER 03 • TOPIC-BASED HUBS
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-100 light:text-slate-900 tracking-tight">
              Organized Channels, Not Noisy Social Feeds
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-400 max-w-md">
            Join laser-focused channels curated for engineering specializations, competitions, and career goals.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CHANNELS_DATA.slice(0, 8).map(channel => (
            <div
              key={channel.id}
              className="p-4 rounded-3xl glass-panel bg-slate-900/50 light:bg-white/80 border border-slate-800 light:border-slate-200 hover:border-blue-500/40 transition-all"
            >
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold mb-2 shadow-xs"
                style={{ backgroundColor: channel.color + '20', color: channel.color }}
              >
                #{channel.slug[0].toUpperCase()}
              </div>
              <h4 className="font-display font-bold text-sm text-slate-200 light:text-slate-800 truncate">
                #{channel.slug}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                {channel.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: CAREER HORIZON & PLACEMENTS
          ========================================================================= */}
      <section id="placements" className="relative p-8 md:p-12 rounded-3xl glass-panel-elevated bg-slate-950/90 light:bg-white/90 border border-slate-800 light:border-slate-200 overflow-hidden">
        <div className="w-full">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>CHAPTER 04 • CAREER HORIZON & PLACEMENTS</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-100 light:text-slate-900 tracking-tight leading-tight">
              Step Into Verified Career Horizons
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 leading-relaxed">
              Discover real campus placement statistics, package distributions, and company interview patterns. Learn how past batches stepped into top tech careers at Google, Atlassian, Microsoft, and Amazon.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 light:bg-slate-50 light:border-slate-200">
                <span className="text-xs font-semibold text-slate-400">Highest Package</span>
                <div className="font-display font-black text-2xl text-orange-400 mt-0.5">48.5 LPA</div>
                <span className="text-[10px] text-slate-500">Google & Atlassian</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 light:bg-slate-50 light:border-slate-200">
                <span className="text-xs font-semibold text-slate-400">Average Package</span>
                <div className="font-display font-black text-2xl text-blue-400 mt-0.5">14.2 LPA</div>
                <span className="text-[10px] text-emerald-400">↑ 14% Annual Growth</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: PRIVACY SHIELD & ANIME AVATARS
          ========================================================================= */}
      <section id="privacy" className="relative p-8 md:p-12 rounded-3xl glass-panel-elevated bg-slate-950/90 light:bg-white/90 border-2 border-orange-500/30 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>CHAPTER 05 • PRIVACY-FIRST IDENTITY</span>
            </div>

            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-100 light:text-slate-900 tracking-tight leading-tight mb-4">
              Anonymous Codenames.<br />
              <span className="text-orange-400">Zero Real Names Leaked.</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 leading-relaxed space-y-2 mb-6">
              Engineering students often hesitate to ask beginner questions in fear of being judged by peers or seniors. 
              MentorSphere solves this by generating unique public codenames like <strong className="text-blue-400 font-mono">KnightRider</strong> and <strong className="text-orange-400 font-mono">PixelNinja</strong> alongside cool anime avatars. Real names remain 100% private.
            </p>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-slate-300 light:text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Anti-bullying & zero judgment discussions</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300 light:text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Anime avatar studio — no personal photo uploads required</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300 light:text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AI safety shield prevents harassment & abuse</span>
              </div>
            </div>
          </div>

          {/* Visual Avatar Grid Showcase */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 light:bg-slate-50 light:border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3 text-center">
              Anime Avatar Roster Selection:
            </span>
            <div className="grid grid-cols-4 gap-3">
              {ANIME_AVATARS.slice(0, 8).map(av => (
                <div key={av.id} className="flex flex-col items-center p-2 rounded-2xl bg-slate-950/60 border border-slate-800/80 light:bg-white light:border-slate-200">
                  <AnimeAvatar avatarId={av.id} size="md" />
                  <span className="text-[9px] font-bold text-slate-300 light:text-slate-700 mt-1 truncate max-w-full">
                    {av.name.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FINAL CTA & LAUNCH PORTAL (WITH STEPPING ARTWORK)
          ========================================================================= */}
      <section className="relative text-center py-16 overflow-hidden rounded-3xl glass-panel-elevated bg-slate-950/90 border border-orange-500/30 p-8 md:p-16">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="/media/career_stepping.jpeg"
            alt="Career Portal"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-orange-500 text-white shadow-xl shadow-blue-500/25">
            <Zap className="w-8 h-8" />
          </div>

          <h2 className="font-display font-black text-4xl sm:text-6xl text-slate-100 light:text-slate-900 tracking-tight leading-tight">
            "Your next mentor might already be in your college."
          </h2>

          <p className="text-sm sm:text-base text-slate-400 light:text-slate-600 max-w-xl mx-auto">
            Join your college's official MentorSphere ecosystem today. Choose your anime avatar, claim your codename, and start learning with seniors.
          </p>

          <div className="pt-4">
            <button
              onClick={onOpenSignup}
              className="px-10 py-5 rounded-3xl font-display font-black text-base text-white bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 hover:from-blue-500 hover:to-orange-400 shadow-2xl shadow-blue-500/30 flex items-center gap-3 mx-auto transition-all hover:scale-105 active:scale-95"
            >
              <span>Join MentorSphere Guild</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
