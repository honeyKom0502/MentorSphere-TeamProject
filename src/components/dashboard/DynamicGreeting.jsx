import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Sunset, Moon, Sparkles, Plus, MessageSquare, Users, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../common/Badge';

// Resolve a display first-name from whatever the auth layer provides
// (demo accounts, backend login/signup, or older saved sessions).
const getFirstName = (user) => {
  const candidates = [user?.fullName, user?.name, user?.displayName, user?.firstName];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) {
      return c.trim().split(/\s+/)[0];
    }
  }
  return '';
};

export const DynamicGreeting = ({ onOpenCreateDiscussion, onExploreChannels, onFindMentors }) => {
  const { user } = useAuth();

  // Re-evaluate the time of day periodically so the greeting stays correct
  // if the dashboard is left open across a time-of-day boundary.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreetingData = () => {
    const hour = now.getHours();
    if (hour >= 5 && hour < 12) {
      return {
        text: 'Good Morning',
        subtext: 'Fresh morning in the college tech guild. What are you building today?',
        icon: <Sun className="w-6 h-6 text-amber-400 animate-spin-slow" />,
        bgGlow: 'from-amber-500/10 to-blue-500/10'
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        text: 'Good Afternoon',
        subtext: 'Afternoon discussions are buzzing in DSA and Placements channels.',
        icon: <Sun className="w-6 h-6 text-orange-400" />,
        bgGlow: 'from-orange-500/10 to-blue-500/10'
      };
    } else if (hour >= 17 && hour < 21) {
      return {
        text: 'Good Evening',
        subtext: 'Seniors and alumni are active for evening code reviews and mock questions.',
        icon: <Sunset className="w-6 h-6 text-orange-400" />,
        bgGlow: 'from-purple-500/10 to-orange-500/10'
      };
    } else {
      return {
        text: 'Good Night',
        subtext: 'Late night coding session? Remember to stay hydrated and test edge cases.',
        icon: <Moon className="w-6 h-6 text-blue-400" />,
        bgGlow: 'from-blue-600/10 to-purple-600/10'
      };
    }
  };

  const greeting = getGreetingData();
  const firstName = getFirstName(user);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-3xl p-6 md:p-8 glass-panel-elevated bg-gradient-to-r ${greeting.bgGlow} border border-slate-800/80 light:border-slate-200 shadow-xl`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {greeting.icon}
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              {greeting.text}
            </span>
            <RoleBadge role={user?.role} size="sm" />
          </div>

          <h2 className="font-display font-black text-2xl md:text-3xl text-slate-100 light:text-slate-900 tracking-tight">
            {firstName ? `${greeting.text}, ${firstName}` : greeting.text} 👋
          </h2>

          <p className="text-xs md:text-sm text-slate-400 light:text-slate-600 mt-1 max-w-xl">
            {greeting.subtext}
          </p>

          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 light:text-slate-600">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Posting as: <strong className="text-blue-400 font-mono">{user?.publicId}</strong> (Real name kept strictly private)</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenCreateDiscussion}
            className="px-4 py-2.5 rounded-2xl font-display font-bold text-xs text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Ask a Question</span>
          </button>

          <button
            onClick={onExploreChannels}
            className="px-4 py-2.5 rounded-2xl font-display font-semibold text-xs text-slate-200 light:text-slate-800 bg-slate-800/80 hover:bg-slate-700/80 light:bg-white light:border light:border-slate-300 flex items-center gap-2 transition-all hover:scale-105"
          >
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span>Explore Channels</span>
          </button>

          <button
            onClick={onFindMentors}
            className="px-4 py-2.5 rounded-2xl font-display font-semibold text-xs text-slate-200 light:text-slate-800 bg-slate-800/80 hover:bg-slate-700/80 light:bg-white light:border light:border-slate-300 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>Find Mentors</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
