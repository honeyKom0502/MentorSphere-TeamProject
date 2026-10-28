import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Hash, 
  Users, 
  MessageSquare, 
  Plus, 
  Search, 
  Check, 
  ThumbsUp,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { CHANNELS_DATA } from '../../data/mockData';
import { DiscussionListState } from '../discussions/DiscussionListState';
import { AnimeAvatar } from '../../data/animeAvatars';
import { RoleBadge } from '../common/Badge';

export const ChannelView = ({ channelId, onBack, onOpenCreateDiscussion, onSelectDiscussion, discussionsList, loading = false, error = '', onRetry }) => {
  const { user, toggleJoinChannel } = useAuth();
  const { showToast } = useNotifications();
  const [search, setSearch] = useState('');

  const channel = CHANNELS_DATA.find(c => c.id === channelId) || CHANNELS_DATA[0];
  const isJoined = user?.joinedChannels?.includes(channel.id);

  // Filter discussions for this channel
  const channelDiscussions = (discussionsList || []).filter(d => d.channelId === channel.id);

  const filtered = channelDiscussions.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.content.toLowerCase().includes(search.toLowerCase()) ||
    d.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleToggleJoin = () => {
    toggleJoinChannel(channel.id);
    showToast(
      !isJoined ? `Joined #${channel.slug} channel!` : `Left #${channel.slug} channel`,
      !isJoined ? 'success' : 'info'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-elevated bg-slate-950/80 light:bg-white/90 border border-slate-800 light:border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-100 light:hover:text-slate-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Channels</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div 
              className="w-14 h-14 rounded-3xl flex items-center justify-center font-display font-black text-2xl shadow-lg shrink-0"
              style={{ backgroundColor: channel.color + '25', color: channel.color, border: `1px solid ${channel.color}50` }}
            >
              #{channel.slug[0].toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display font-black text-2xl md:text-3xl text-slate-100 light:text-slate-900 tracking-tight">
                  #{channel.slug}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
                  {channel.category}
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-400 light:text-slate-600 max-w-xl leading-relaxed">
                {channel.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleToggleJoin}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isJoined
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-rose-500/15 hover:text-rose-400'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
              }`}
            >
              {isJoined ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Joined Hub</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Join Channel</span>
                </>
              )}
            </button>

            <button
              onClick={() => onOpenCreateDiscussion(channel.id)}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Ask Question</span>
            </button>
          </div>
        </div>

        {/* Channel Tags */}
        <div className="flex items-center gap-2 flex-wrap mt-4 pt-4 border-t border-slate-800/60 light:border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Active Topics:
          </span>
          {channel.tags?.map(t => (
            <span key={t} className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 light:bg-slate-100 light:border-slate-200 light:text-slate-700">
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Discussion List Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search discussions in #${channel.slug}...`}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs font-medium bg-slate-900/80 border border-slate-800 focus:outline-none focus:border-blue-500 text-slate-200 light:bg-white light:border-slate-300 light:text-slate-900"
          />
        </div>

        <span className="text-xs font-bold text-slate-400">
          {filtered.length} Threads
        </span>
      </div>

      {/* Loading / error states (empty state is handled below) */}
      {(loading || error) && (
        <DiscussionListState
          loading={loading}
          error={error}
          isEmpty={(discussionsList || []).length === 0}
          onRetry={onRetry}
        />
      )}

      {/* Discussions Threads Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          loading ? null : <div className="p-12 text-center rounded-3xl glass-panel bg-slate-900/30 border border-dashed border-slate-800 text-slate-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-500" />
            <h4 className="font-display font-bold text-sm text-slate-300 light:text-slate-800">
              No discussions found in #{channel.slug}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Be the first student to kick off a topic or ask seniors for help in this channel!
            </p>
            <button
              onClick={() => onOpenCreateDiscussion(channel.id)}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
            >
              Start First Discussion
            </button>
          </div>
        ) : (
          filtered.map((disc) => (
            <motion.div
              key={disc.id}
              whileHover={{ scale: 1.006 }}
              onClick={() => onSelectDiscussion(disc)}
              className="p-5 rounded-3xl glass-panel bg-slate-900/50 light:bg-white/80 border border-slate-800/80 light:border-slate-200 hover:border-blue-500/40 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3.5">
                <AnimeAvatar avatarId={disc.authorAvatar} size="md" />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-200 light:text-slate-900 flex items-center gap-1">
                      {disc.isAnonymous ? `Anonymous · ${disc.authorPublicId || 'Member'}` : (disc.authorName || 'Member')}
                      {!disc.isAnonymous && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                    </span>
                    {!disc.isAnonymous && disc.authorRole && <RoleBadge role={disc.authorRole} size="sm" />}
                    <span className="text-[10px] text-slate-500">• {disc.createdAt}</span>
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
          ))
        )}
      </div>
    </div>
  );
};
