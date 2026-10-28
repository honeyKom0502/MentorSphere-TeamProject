import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { DiscussionListState } from '../discussions/DiscussionListState';
import { AnimeAvatar } from '../../data/animeAvatars';
import { RoleBadge } from '../common/Badge';

export const RecentDiscussionsFeed = ({
  onSelectDiscussion,
  onExploreDiscussions,
  discussions = [],
  loading = false,
  error = '',
  onRetry
}) => {
  return (
    <div className="w-full min-w-0 p-6 rounded-3xl glass-panel bg-slate-900/50 light:bg-white/80 border border-slate-800/80 light:border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-slate-100 light:text-slate-900 flex items-center gap-2">
            <span>Live Knowledge Discussions</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </h3>
          <p className="text-xs text-slate-400">Real-time questions & senior advice across campus</p>
        </div>

        <button
          onClick={onExploreDiscussions}
          className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
        >
          View All
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <DiscussionListState
        loading={loading}
        error={error}
        isEmpty={discussions.length === 0}
        onRetry={onRetry}
      />

      <div className="space-y-3">
        {discussions.slice(0, 3).map((disc) => (
          <motion.div
            key={disc.id}
            whileHover={{ scale: 1.008 }}
            onClick={() => onSelectDiscussion(disc)}
            className="p-4 rounded-2xl bg-slate-950/60 light:bg-slate-50 border border-slate-800/80 light:border-slate-200 hover:border-blue-500/40 transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-start gap-3">
              <AnimeAvatar avatarId={disc.authorAvatar} size="md" />

              <div className="flex-1 min-w-0">
                {/* Author Info */}
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-200 light:text-slate-900 flex items-center gap-1">
                    {disc.isAnonymous ? `Anonymous · ${disc.authorPublicId || 'Member'}` : (disc.authorName || 'Member')}
                    {!disc.isAnonymous && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                  </span>
                  {!disc.isAnonymous && disc.authorRole && <RoleBadge role={disc.authorRole} size="sm" />}
                  <span className="text-[10px] text-slate-500">• {disc.createdAt}</span>
                  <span className="ml-auto text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400">
                    #{disc.channelId}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-slate-100 light:text-slate-900 leading-snug hover:text-blue-400 transition-colors">
                  {disc.title}
                </h4>

                <p className="text-xs text-slate-400 light:text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                  {disc.content}
                </p>

                {/* Tags and Stats */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-900 light:border-slate-200">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {disc.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 light:bg-slate-200 light:text-slate-700">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-orange-400">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {disc.upvotes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
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
