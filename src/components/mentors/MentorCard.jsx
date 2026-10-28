import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Star, 
  MessageSquare, 
  Check, 
  Plus, 
  ShieldCheck, 
  Send,
  Sparkles,
  Building,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { AnimeAvatar } from '../../data/animeAvatars';
import { RoleBadge, SkillPill } from '../common/Badge';

export const MentorCard = ({ mentor, onAskQuestion }) => {
  const { user, toggleConnectMentor } = useAuth();
  const { showToast } = useNotifications();

  const isConnected = user?.connectedMentors?.includes(mentor.id);

  const handleToggleConnect = (e) => {
    e.stopPropagation();
    toggleConnectMentor(mentor.id);
    showToast(
      !isConnected ? `Connected with ${mentor.publicId}!` : `Removed connection with ${mentor.publicId}`,
      !isConnected ? 'success' : 'info'
    );
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-5 md:p-6 rounded-3xl glass-panel bg-slate-900/50 light:bg-white/85 border border-slate-800/80 light:border-slate-200 hover:border-blue-500/40 hover:shadow-xl transition-all flex flex-col justify-between"
    >
      <div>
        {/* Top Profile Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <AnimeAvatar avatarId={mentor.avatar} size="lg" />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-bold text-base text-slate-100 light:text-slate-900">
                  {mentor.publicId}
                </h3>
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <RoleBadge role={mentor.role} size="sm" className="mt-1" />
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{mentor.rating}</span>
          </div>
        </div>

        {/* Track & Department */}
        <div className="mb-3 p-3 rounded-2xl bg-slate-950/60 light:bg-slate-50 border border-slate-800/80 light:border-slate-200">
          <p className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{mentor.companyOrTrack}</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">{mentor.department}</p>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-400 light:text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {mentor.bio}
        </p>

        {/* Skills */}
        <div className="space-y-1.5 mb-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Expertise & Skills:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {mentor.skills?.slice(0, 4).map(skill => (
              <span 
                key={skill}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Stats & Actions */}
      <div className="pt-4 border-t border-slate-800/60 light:border-slate-200 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <strong>{mentor.helpedCount}</strong> students guided
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
            {mentor.availability}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleToggleConnect}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              isConnected
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 light:bg-slate-100 light:text-slate-800'
            }`}
          >
            {isConnected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isConnected ? 'Connected' : 'Connect'}</span>
          </button>

          <button
            onClick={() => onAskQuestion(mentor)}
            className="py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-sm shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask Doubt</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
