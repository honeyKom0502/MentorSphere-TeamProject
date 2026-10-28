import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, 
  Shield, 
  ShieldCheck, 
  Lock, 
  Edit3, 
  Sparkles, 
  Hash, 
  Users, 
  Bookmark, 
  MessageSquare,
  Award,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AnimeAvatar } from '../../data/animeAvatars';
import { RoleBadge } from '../common/Badge';
import { EditProfileModal } from './EditProfileModal';

export const ProfileView = () => {
  const { user } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-elevated bg-slate-950/80 light:bg-white/90 border border-slate-800 light:border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <AnimeAvatar avatarId={user?.avatar || 'avatar-1'} size="xl" className="shadow-2xl ring-4 ring-blue-500/20" />

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="font-display font-black text-2xl md:text-3xl text-slate-100 light:text-slate-900 tracking-tight">
                  {user?.publicId}
                </h2>
                <ShieldCheck className="w-5 h-5 text-blue-400" title="Verified College Member" />
                <RoleBadge role={user?.role} size="md" />
              </div>

              <p className="text-xs text-slate-400 font-mono">
                Student Cyber Identity • Active since {new Date(user?.createdAt || Date.now()).getFullYear()}
              </p>

              <div className="flex items-center gap-2 mt-3 text-xs text-slate-400 bg-slate-900/60 light:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-800 light:border-slate-200 max-w-fit">
                <Lock className="w-3.5 h-3.5 text-orange-400" />
                <span>Real Name: <strong className="text-slate-200 light:text-slate-800">{user?.fullName}</strong> (Private / Safe)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditOpen(true)}
            className="px-5 py-2.5 rounded-2xl font-display font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/25 flex items-center gap-2 transition-all hover:scale-105 shrink-0 self-start md:self-auto"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl glass-panel bg-slate-900/50 light:bg-white/80 border border-slate-800/80 light:border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Hash className="w-4 h-4 text-blue-400" />
            <span>Joined Channels</span>
          </div>
          <div className="font-display font-black text-2xl text-slate-100 light:text-slate-900">
            {user?.joinedChannels?.length || 0}
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-panel bg-slate-900/50 light:bg-white/80 border border-slate-800/80 light:border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Users className="w-4 h-4 text-orange-400" />
            <span>Mentors Connected</span>
          </div>
          <div className="font-display font-black text-2xl text-orange-400">
            {user?.connectedMentors?.length || 0}
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-panel bg-slate-900/50 light:bg-white/80 border border-slate-800/80 light:border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Bookmark className="w-4 h-4 text-purple-400" />
            <span>Saved Resources</span>
          </div>
          <div className="font-display font-black text-2xl text-purple-400">
            {user?.savedResources?.length || 18}
          </div>
        </div>

        <div className="p-5 rounded-3xl glass-panel bg-slate-900/50 light:bg-white/80 border border-slate-800/80 light:border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Help Karma Score</span>
          </div>
          <div className="font-display font-black text-2xl text-emerald-400">
            {user?.helpedCount || (user?.role === 'Senior' ? 142 : user?.role === 'Alumni' ? 230 : 28)}
          </div>
        </div>
      </div>

      {/* Skills & Interests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verified Skills */}
        <div className="p-6 rounded-3xl glass-panel bg-slate-900/50 light:bg-white/80 border border-slate-800/80 light:border-slate-200 space-y-3">
          <h3 className="font-display font-bold text-base text-slate-100 light:text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>My Tech Skills</span>
          </h3>
          <p className="text-xs text-slate-400">
            Visible on your mentor cards and question metadata.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {user?.skills?.map(skill => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-500/30 text-xs font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Selected Interests */}
        <div className="p-6 rounded-3xl glass-panel bg-slate-900/50 light:bg-white/80 border border-slate-800/80 light:border-slate-200 space-y-3">
          <h3 className="font-display font-bold text-base text-slate-100 light:text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-400" />
            <span>Tracked Interests</span>
          </h3>
          <p className="text-xs text-slate-400">
            Used to curate recommended channels, discussions, and placement alerts.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {user?.interests?.map(interest => (
              <span
                key={interest}
                className="px-3 py-1.5 rounded-xl bg-orange-500/15 text-orange-300 border border-orange-500/30 text-xs font-semibold"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
};
