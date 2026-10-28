import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  Sparkles,
  Share2,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { AnimeAvatar } from '../../data/animeAvatars';
import { RoleBadge } from '../common/Badge';
import { moderationService } from '../../services/moderationService';
import { createReply, deleteDiscussion, deleteReply } from '../../services/discussionService';
import { ModerationAlert } from './ModerationAlert';

export const DiscussionDetailModal = ({ discussion, isOpen, onClose, onUpdateDiscussion, onDeleteDiscussion }) => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [replyText, setReplyText] = useState('');
  const [replyAnonymous, setReplyAnonymous] = useState(true);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replyError, setReplyError] = useState('');
  const replyingRef = useRef(false);
  const [upvotes, setUpvotes] = useState(discussion?.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState('');

  // Moderation state
  const [modAlert, setModAlert] = useState({ isOpen: false, reason: '', message: '' });

  if (!isOpen || !discussion) return null;

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
      showToast('Upvoted discussion!', 'success');
    } else {
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
    }
  };

  const handleDeleteDiscussion = async () => {
    if (!discussion?.isMine) return;
    if (!window.confirm('Delete this discussion and all its replies?')) return;
    setDeletingItemId(discussion.id);
    try {
      await deleteDiscussion(discussion.id);
      showToast('Discussion deleted.', 'success');
      onDeleteDiscussion?.(discussion.id);
      onClose();
    } catch (err) {
      showToast(err.message || 'Could not delete discussion.', 'error');
    } finally {
      setDeletingItemId('');
    }
  };

  const handleDeleteReply = async (reply) => {
    if (!reply?.isMine) return;
    if (!window.confirm('Delete your reply?')) return;
    setDeletingItemId(reply.id);
    try {
      const saved = await deleteReply(discussion.id, reply.id);
      onUpdateDiscussion(saved);
      showToast('Reply deleted.', 'success');
    } catch (err) {
      showToast(err.message || 'Could not delete reply.', 'error');
    } finally {
      setDeletingItemId('');
    }
  };

  const handleAddReply = async (e) => {
    e.preventDefault();

    // Ignore repeated clicks / Enter presses while a reply is being saved.
    if (replyingRef.current) return;

    const text = replyText.trim();
    if (!text) {
      showToast('Please type your response', 'warning');
      return;
    }

    replyingRef.current = true;
    setIsSubmittingReply(true);
    setReplyError('');

    try {
      // AI Safety Moderation
      const check = await moderationService.evaluateMessage(text);
      if (!check.isClean) {
        setModAlert({
          isOpen: true,
          reason: check.flaggedReason,
          message: check.friendlyMessage
        });
        return;
      }

      // Saved in MongoDB, attached to this discussion, author taken from the session token.
      const { discussion: saved } = await createReply(discussion.id, text, replyAnonymous);

      setReplyText('');
      onUpdateDiscussion(saved);
      showToast('Your answer has been posted!', 'success');
    } catch (err) {
      if (err?.code === 'MODERATION_REJECTED') {
        setModAlert({
          isOpen: true,
          reason: err.data?.flaggedReason,
          message: err.message
        });
      } else {
        const message = err?.message || 'Could not save your reply. Please try again.';
        setReplyError(message);
        showToast(message, 'error');
      }
    } finally {
      replyingRef.current = false;
      setIsSubmittingReply(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        <div 
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl rounded-3xl glass-panel-elevated bg-slate-950/95 light:bg-white/95 border border-slate-800 light:border-slate-200 p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 light:hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-6">
              {/* Header Info */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-bold">
                    #{discussion.channelId}
                  </span>
                  <span className="text-xs text-slate-500">• {discussion.createdAt}</span>
                </div>

                <h2 className="font-display font-black text-xl md:text-2xl text-slate-100 light:text-slate-900 tracking-tight leading-snug">
                  {discussion.title}
                </h2>
              </div>

              {/* Author & Main Post Content */}
              <div className={`flex ${discussion.isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`w-full max-w-[95%] p-5 rounded-2xl border space-y-4 ${discussion.isMine ? 'bg-blue-950/50 border-blue-700/50 rounded-br-sm' : 'bg-slate-900/60 light:bg-slate-50 border-slate-800 light:border-slate-200 rounded-bl-sm'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AnimeAvatar avatarId={discussion.isAnonymous ? 'avatar-1' : discussion.authorAvatar} size="md" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-200 light:text-slate-900">{discussion.isAnonymous ? `Anonymous · ${discussion.authorPublicId || 'Member'}` : (discussion.authorName || 'Member')}</span>
                        {!discussion.isAnonymous && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                      {!discussion.isAnonymous && discussion.authorRole && <RoleBadge role={discussion.authorRole} size="sm" />}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {discussion.isMine && <button onClick={handleDeleteDiscussion} disabled={!!deletingItemId} title="Delete your discussion" className="p-2 rounded-xl text-rose-300 hover:bg-rose-500/10 disabled:opacity-50"><Trash2 className="w-4 h-4"/></button>}
                    <button
                      onClick={handleUpvote}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        hasUpvoted
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 light:bg-slate-200 light:text-slate-800'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{upvotes}</span>
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-300 light:text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {discussion.content}
                </p>

                {/* Tags */}
                {discussion.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60 light:border-slate-200">
                    {discussion.tags.map(t => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 light:bg-slate-200 light:text-slate-700">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
                </div>
              </div>

              {/* Replies Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-sm text-slate-200 light:text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-orange-400" />
                    <span>Responses & Answers ({discussion.replies?.length || 0})</span>
                  </h3>
                </div>

                {(!discussion.replies || discussion.replies.length === 0) ? (
                  <div className="p-8 text-center rounded-2xl bg-slate-900/30 border border-dashed border-slate-800 text-slate-400 text-xs">
                    No answers yet. Be the first senior or peer to reply!
                  </div>
                ) : (
                  discussion.replies.map((rep) => (
                    <div key={rep.id} className={`flex ${rep.isMine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`w-full max-w-[88%] p-4 rounded-2xl border transition-all ${
                        rep.isMine
                          ? 'bg-blue-950/50 border-blue-700/50 rounded-br-sm'
                          : rep.isAccepted
                            ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm rounded-bl-sm'
                            : 'bg-slate-900/40 light:bg-slate-50 border-slate-800 light:border-slate-200 rounded-bl-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <AnimeAvatar avatarId={rep.isAnonymous ? 'avatar-1' : rep.authorAvatar} size="sm" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-200 light:text-slate-900">
                                {rep.isAnonymous ? `Anonymous · ${rep.authorPublicId || 'Member'}` : (rep.authorName || 'Member')}
                              </span>
                              {!rep.isAnonymous && rep.authorRole && <RoleBadge role={rep.authorRole} size="sm" />}
                            </div>
                            <span className="text-[10px] text-slate-500">{rep.createdAt}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {rep.isAccepted && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Verified Senior Answer
                            </span>
                          )}
                          {rep.isMine && <button onClick={() => handleDeleteReply(rep)} disabled={!!deletingItemId} title="Delete your reply" className="p-1.5 rounded-lg text-rose-300 hover:bg-rose-500/10 disabled:opacity-50"><Trash2 className="w-3.5 h-3.5"/></button>}
                        </div>
                      </div>

                      <p className="text-xs md:text-sm text-slate-300 light:text-slate-700 leading-relaxed whitespace-pre-wrap pl-1">
                        {rep.content}
                      </p>
                    </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Reply save error */}
            {replyError && (
              <div
                role="alert"
                className="mt-3 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 light:text-rose-700 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{replyError}</span>
              </div>
            )}

            {/* Bottom Reply Form */}
            <div className="mt-4 pt-4 border-t border-slate-800 light:border-slate-200 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">How should your reply appear?</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => setReplyAnonymous(false)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${!replyAnonymous ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 light:bg-slate-100 light:text-slate-700'}`}>Public profile</button>
                <button type="button" onClick={() => setReplyAnonymous(true)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${replyAnonymous ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-300 light:bg-slate-100 light:text-slate-700'}`}>Anonymous</button>
              </div>
            </div>
            <form onSubmit={handleAddReply} className="mt-2 pt-2 flex gap-2">
              <input
                type="text"
                value={replyText}
                maxLength={3000}
                disabled={isSubmittingReply}
                onChange={(e) => {
                  setReplyText(e.target.value);
                  if (replyError) setReplyError('');
                }}
                placeholder={replyAnonymous ? 'Write an anonymous reply…' : `Reply as ${user?.fullName || user?.name || 'your name'}…`}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 light:bg-white light:border-slate-300 light:text-slate-900"
              />
              <button
                type="submit"
                disabled={isSubmittingReply || !replyText.trim()}
                className="px-4 py-2.5 rounded-xl font-display font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 flex items-center gap-1.5 transition-all shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Answer</span>
              </button>
            </form>
          </motion.div>
        </div>
      </AnimatePresence>

      <ModerationAlert
        isOpen={modAlert.isOpen}
        reason={modAlert.reason}
        friendlyMessage={modAlert.message}
        onClose={() => setModAlert({ isOpen: false, reason: '', message: '' })}
      />
    </>
  );
};
