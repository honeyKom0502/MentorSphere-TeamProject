import React from 'react';
import { motion } from 'framer-motion';
import { Hash, Users, Bookmark, MessageSquare, TrendingUp, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MetricCards = ({ onSelectTab }) => {
  const { user } = useAuth();

  const metrics = [
    {
      id: 'channels',
      label: 'Channels Joined',
      value: user?.joinedChannels?.length || 0,
      icon: Hash,
      color: 'from-blue-600 to-cyan-500',
      textColor: 'text-blue-400',
      badge: 'Active Hubs',
      tab: 'channels'
    },
    {
      id: 'mentors',
      label: 'Mentors Connected',
      value: user?.connectedMentors?.length || 0,
      icon: Users,
      color: 'from-orange-500 to-amber-500',
      textColor: 'text-orange-400',
      badge: '1-on-1 Network',
      tab: 'mentors'
    },
    {
      id: 'resources',
      label: 'Saved Resources',
      value: user?.savedResources?.length || 18,
      icon: Bookmark,
      color: 'from-purple-600 to-pink-500',
      textColor: 'text-purple-400',
      badge: 'Roadmaps & Notes',
      tab: 'profile'
    },
    {
      id: 'karma',
      label: 'Discussion Impact',
      value: user?.helpedCount || (user?.role === 'Senior' ? 142 : user?.role === 'Alumni' ? 230 : 28),
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-400',
      badge: 'Helpful Karma',
      tab: 'discussions'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, index) => {
        const Icon = m.icon;
        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectTab(m.tab)}
            className="group cursor-pointer p-4 md:p-5 rounded-3xl glass-panel bg-slate-900/60 light:bg-white/80 border border-slate-800/80 light:border-slate-200 hover:border-slate-700 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            {/* Top row */}
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 light:bg-slate-100 light:text-slate-700">
                {m.badge}
              </span>
            </div>

            {/* Value & Label */}
            <div>
              <div className="font-display font-black text-2xl md:text-3xl text-slate-100 light:text-slate-900 tracking-tight flex items-baseline gap-1">
                <span>{m.value}</span>
                <span className="text-xs font-semibold text-slate-400">{m.id === 'karma' ? 'pts' : ''}</span>
              </div>
              <p className="text-xs font-semibold text-slate-400 light:text-slate-600 mt-0.5 truncate">
                {m.label}
              </p>
            </div>

            {/* Subtle glow bottom edge */}
            <div className={`absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r ${m.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
          </motion.div>
        );
      })}
    </div>
  );
};
