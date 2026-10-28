import React from 'react';
import { motion } from 'framer-motion';
import { 
  Hash, 
  ArrowRight, 
  Users, 
  MessageSquare, 
  Sparkles,
  Code2,
  Globe,
  Cpu,
  Briefcase,
  Compass,
  Cloud,
  Shield,
  Trophy,
  FolderGit2,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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

export const JoinedChannelsGrid = ({ onOpenChannel, onExploreAll }) => {
  const { user, toggleJoinChannel } = useAuth();

  const joined = CHANNELS_DATA.filter(c => user?.joinedChannels?.includes(c.id));
  
  // Recommended channels (not yet joined)
  const recommended = CHANNELS_DATA.filter(c => !user?.joinedChannels?.includes(c.id)).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Joined Channels Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-lg text-slate-100 light:text-slate-900 flex items-center gap-2">
            <span>My Active Channels</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono">
              {joined.length}
            </span>
          </h3>
          <p className="text-xs text-slate-400">Jump directly into topic discussions with your peers</p>
        </div>

        <button
          onClick={onExploreAll}
          className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
        >
          Explore All ({CHANNELS_DATA.length})
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {joined.map((channel) => {
          const IconComponent = ICON_MAP[channel.icon] || Hash;
          return (
            <motion.div
              key={channel.id}
              whileHover={{ y: -3 }}
              className="p-4 rounded-3xl glass-panel bg-slate-900/50 light:bg-white/80 border border-slate-800/80 light:border-slate-200 hover:border-blue-500/40 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: channel.color + '25', color: channel.color, border: `1px solid ${channel.color}40` }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 rounded-full bg-slate-800/60 light:bg-slate-100">
                    {channel.category}
                  </span>
                </div>

                <h4 className="font-display font-bold text-sm text-slate-100 light:text-slate-900 truncate">
                  {channel.name}
                </h4>
                <p className="text-xs text-slate-400 light:text-slate-600 line-clamp-2 mt-1 leading-snug">
                  {channel.description}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-4 mt-3 border-t border-slate-800/60 light:border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {channel.memberCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {channel.discussionCount}
                  </span>
                </div>

                <button
                  onClick={() => onOpenChannel(channel.id)}
                  className="font-bold text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
                >
                  Enter
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recommended Channels Banner */}
      {recommended.length > 0 && (
        <div className="w-full p-5 rounded-3xl bg-gradient-to-r from-blue-900/20 via-slate-900/40 to-orange-900/20 border border-slate-800 light:bg-slate-100 light:border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <h4 className="font-display font-bold text-xs text-slate-200 light:text-slate-900 uppercase tracking-wider">
              Recommended for your skills & role:
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3 w-full">
            {recommended.map((rec) => {
              const IconComponent = ICON_MAP[rec.icon] || Hash;
              return (
                <div 
                  key={rec.id}
                  className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 light:bg-white light:border-slate-200 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: rec.color + '20', color: rec.color }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-200 light:text-slate-800 block truncate">
                        {rec.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {rec.memberCount} members
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleJoinChannel(rec.id)}
                    className="px-2.5 py-1 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shrink-0 transition-colors"
                  >
                    + Join
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
