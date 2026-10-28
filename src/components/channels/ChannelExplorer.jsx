import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Hash, 
  Search, 
  Users, 
  MessageSquare, 
  Check, 
  Plus, 
  ArrowRight,
  Code2,
  Globe,
  Cpu,
  Briefcase,
  Compass,
  Cloud,
  Shield,
  Trophy,
  FolderGit2,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { CHANNELS_DATA } from '../../data/mockData';

const ICON_MAP = {
  Code2,
  Globe,
  Cpu,
  Briefcase,
  Compass,
  Cloud,
  Shield,
  Trophy,
  FolderGit2,
  Sparkles,
  GraduationCap
};

export const ChannelExplorer = ({ onOpenChannel }) => {
  const { user, toggleJoinChannel } = useAuth();
  const { showToast } = useNotifications();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Tech & Coding', 'Careers & Hiring', 'Collaboration', 'General'];

  const filtered = CHANNELS_DATA.filter(c => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleToggleJoin = (e, channel) => {
    e.stopPropagation();
    toggleJoinChannel(channel.id);
    const isNowJoined = !user?.joinedChannels?.includes(channel.id);
    showToast(
      isNowJoined ? `Joined #${channel.slug} channel!` : `Left #${channel.slug} channel`,
      isNowJoined ? 'success' : 'info'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-elevated bg-gradient-to-r from-blue-900/30 via-slate-950 to-orange-950/20 border border-slate-800 light:border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
              <Hash className="w-4 h-4" />
              <span>Topic-Based Student Guilds</span>
            </div>
            <h2 className="font-display font-black text-2xl md:text-3xl text-slate-100 light:text-slate-900 tracking-tight">
              Explore College Channels
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
              Communication in MentorSphere happens through dedicated channels rather than noisy feeds. Join hubs that match your goals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-center light:bg-white light:border-slate-300">
              <span className="font-display font-black text-xl text-blue-400 block">
                {CHANNELS_DATA.length}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Available</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-center light:bg-white light:border-slate-300">
              <span className="font-display font-black text-xl text-orange-400 block">
                {user?.joinedChannels?.length || 0}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Joined</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls: Search & Category Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter channels by name, topic, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-medium bg-slate-900/80 border border-slate-800 focus:outline-none focus:border-blue-500 text-slate-200 light:bg-white light:border-slate-300 light:text-slate-900"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 light:bg-white light:text-slate-700 light:border light:border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((channel) => {
          const IconComponent = ICON_MAP[channel.icon] || Hash;
          const isJoined = user?.joinedChannels?.includes(channel.id);

          return (
            <motion.div
              key={channel.id}
              whileHover={{ y: -3 }}
              onClick={() => onOpenChannel(channel.id)}
              className={`p-5 rounded-3xl glass-panel border transition-all cursor-pointer flex flex-col justify-between ${
                isJoined 
                  ? 'bg-slate-900/60 light:bg-white/90 border-slate-800/80 light:border-slate-200 hover:border-blue-500/50' 
                  : 'bg-slate-950/40 light:bg-slate-50/80 border-slate-800/40 light:border-slate-200 opacity-90 hover:opacity-100 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-transform"
                    style={{ backgroundColor: channel.color + '20', color: channel.color, border: `1px solid ${channel.color}40` }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <button
                    onClick={(e) => handleToggleJoin(e, channel)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isJoined
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-rose-500/15 hover:text-rose-400 hover:border-rose-500/30'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Joined</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Join</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-bold text-base text-slate-100 light:text-slate-900">
                    {channel.name}
                  </h3>
                  {channel.isPopular && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
                      Popular
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed mb-3 line-clamp-2">
                  {channel.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {channel.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 light:bg-slate-200 light:text-slate-700">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Footer */}
              <div className="pt-3 border-t border-slate-800/60 light:border-slate-200 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold text-slate-300 light:text-slate-700">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    {channel.memberCount} members
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
                    {channel.discussionCount}
                  </span>
                </div>

                <span className="text-blue-400 font-bold text-xs flex items-center gap-1">
                  Enter Channel
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
