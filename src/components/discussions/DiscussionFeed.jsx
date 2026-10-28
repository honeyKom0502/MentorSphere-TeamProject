import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  ThumbsUp, 
  ShieldCheck, 
  Sparkles,
  Filter,
  Layers,
  Trash2
} from 'lucide-react';
import { CHANNELS_DATA } from '../../data/mockData';
import { DiscussionListState } from './DiscussionListState';
import { AnimeAvatar } from '../../data/animeAvatars';
import { RoleBadge } from '../common/Badge';
import { deleteDiscussion } from '../../services/discussionService';
import { useNotifications } from '../../context/NotificationContext';

export const DiscussionFeed = ({ onSelectDiscussion, onOpenCreateDiscussion, onDeleteDiscussion, discussionsList, loading = false, error = '', onRetry }) => {
  const [search, setSearch] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [deletingId, setDeletingId] = useState('');
  const { showToast } = useNotifications();

  const handleDeleteDiscussion = async (event, disc) => {
    event.stopPropagation();
    if (!disc?.isMine || deletingId) return;
    if (!window.confirm('Delete this discussion and all its replies?')) return;
    setDeletingId(disc.id);
    try {
      await deleteDiscussion(disc.id);
      await onDeleteDiscussion?.(disc.id);
      showToast('Discussion deleted.', 'success');
    } catch (err) {
      showToast(err.message || 'Could not delete discussion.', 'error');
    } finally { setDeletingId(''); }
  };

  const allDiscussions = discussionsList || [];

  const filtered = allDiscussions.filter(disc => {
    const matchesChannel = selectedChannel === 'all' || disc.channelId === selectedChannel;
    const matchesRole = selectedRole === 'all' || (disc.authorRole || '').toLowerCase() === selectedRole.toLowerCase();
    const matchesSearch = disc.title.toLowerCase().includes(search.toLowerCase()) ||
      disc.content.toLowerCase().includes(search.toLowerCase()) ||
      disc.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesChannel && matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-elevated bg-slate-950/80 light:bg-white/90 border border-slate-800 light:border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
              <MessageSquare className="w-4 h-4" />
              <span>Campus Discussions & Knowledge Base</span>
            </div>
            <h2 className="font-display font-black text-2xl md:text-3xl text-slate-100 light:text-slate-900 tracking-tight">
              Peer Questions & Senior Insights
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
              Ask coding doubts, interview questions, project feedback, or roadmap advice anonymously.
            </p>
          </div>

          <button
            onClick={() => onOpenCreateDiscussion()}
            className="px-5 py-3 rounded-2xl font-display font-bold text-xs text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Ask a Question</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search discussions by keyword, tag, or topic..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-medium bg-slate-900/80 border border-slate-800 focus:outline-none focus:border-blue-500 text-slate-200 light:bg-white light:border-slate-300 light:text-slate-900"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
          {/* Channel Dropdown */}
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 light:bg-white light:border-slate-300 light:text-slate-900"
          >
            <option value="all">All Channels</option>
            {CHANNELS_DATA.map(c => (
              <option key={c.id} value={c.id}>#{c.slug}</option>
            ))}
          </select>

          {/* Role Dropdown */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 light:bg-white light:border-slate-300 light:text-slate-900"
          >
            <option value="all">All Roles</option>
            <option value="junior">Junior Posts</option>
            <option value="senior">Senior Posts</option>
            <option value="alumni">Alumni Posts</option>
          </select>
        </div>
      </div>

      <DiscussionListState
        loading={loading}
        error={error}
        isEmpty={allDiscussions.length === 0}
        onRetry={onRetry}
      />

      {/* Discussions Feed Grid */}
      <div className="space-y-3.5">
        {filtered.map((disc) => (
          <motion.div
            key={disc.id}
            whileHover={{ scale: 1.006 }}
            onClick={() => onSelectDiscussion(disc)}
            className="p-5 rounded-3xl glass-panel bg-slate-900/50 light:bg-white/80 border border-slate-800/80 light:border-slate-200 hover:border-blue-500/40 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3.5">
              <AnimeAvatar avatarId={disc.isAnonymous ? 'avatar-1' : disc.authorAvatar} size="md" />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-slate-200 light:text-slate-900 flex items-center gap-1">
                    {disc.isAnonymous ? `Anonymous · ${disc.authorPublicId || 'Member'}` : (disc.authorName || 'Member')}
                    {!disc.isAnonymous && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                  </span>
                  {!disc.isAnonymous && disc.authorRole && <RoleBadge role={disc.authorRole} size="sm" />}
                  <span className="text-[10px] text-slate-500">• {disc.createdAt}</span>
                  <span className="ml-auto text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400">
                    #{disc.channelId}
                  </span>
                  {disc.isMine && <button type="button" title="Delete your discussion" disabled={deletingId === disc.id} onClick={(event) => handleDeleteDiscussion(event, disc)} className="p-2 rounded-lg text-rose-300 hover:bg-rose-500/10 disabled:opacity-50" aria-label="Delete discussion"><Trash2 className="w-4 h-4"/></button>}
                </div>

                <h3 className="font-display font-bold text-base text-slate-100 light:text-slate-900 leading-snug hover:text-blue-400 transition-colors">
                  {disc.title}
                </h3>

                <p className="text-xs text-slate-400 light:text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                  {disc.content}
                </p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900 light:border-slate-100 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {disc.tags?.map(t => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 light:bg-slate-200 light:text-slate-700">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold text-orange-400">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {disc.upvotes}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-300 light:text-slate-700">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                      {disc.replies?.length || 0} answers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
