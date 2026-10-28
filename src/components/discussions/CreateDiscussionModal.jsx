import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Shield, Sparkles, Send, Tag, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { CHANNELS_DATA } from '../../data/mockData';
import { moderationService } from '../../services/moderationService';
import { createDiscussion } from '../../services/discussionService';
import { AnimeAvatar } from '../../data/animeAvatars';
import { RoleBadge } from '../common/Badge';
import { ModerationAlert } from './ModerationAlert';

export const CreateDiscussionModal = ({ isOpen, onClose, defaultChannelId, onDiscussionCreated }) => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [channelId, setChannelId] = useState(defaultChannelId || 'dsa');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['DSA', 'Roadmap']);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const submittingRef = useRef(false);

  // Moderation state
  const [modAlert, setModAlert] = useState({ isOpen: false, reason: '', message: '' });

  if (!isOpen) return null;

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!tagInput.trim()) return;
    const clean = tagInput.trim().replace(/^#/, '');
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a clear discussion title', 'warning');
      return;
    }
    if (!content.trim()) {
      showToast('Please explain your question or context', 'warning');
      return;
    }

    // Ignore repeated clicks while a save is already in progress.
    if (submittingRef.current) return;
    submittingRef.current = true;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // AI Moderation Evaluation
      const combinedText = `${title} ${content}`;
      const check = await moderationService.evaluateMessage(combinedText);

      if (!check.isClean) {
        setModAlert({
          isOpen: true,
          reason: check.flaggedReason,
          message: check.friendlyMessage
        });
        return;
      }

      // Save to the backend (MongoDB). The author identity comes from the
      // verified session token on the server, not from this form.
      const saved = await createDiscussion({
        channelId,
        title: title.trim(),
        content: content.trim(),
        tags,
        isAnonymous
      });

      onDiscussionCreated(saved);
      showToast('Discussion published to #' + channelId + ' channel!', 'success');

      setTitle('');
      setContent('');
      setTagInput('');
      setTags(['DSA', 'Roadmap']);
      setIsAnonymous(true);
      onClose();
    } catch (err) {
      if (err?.code === 'MODERATION_REJECTED') {
        setModAlert({
          isOpen: true,
          reason: err.data?.flaggedReason,
          message: err.message
        });
      } else {
        const message = err?.message || 'Could not save your question. Please try again.';
        setSubmitError(message);
        showToast(message, 'error');
      }
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        <div 
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl rounded-3xl glass-panel-elevated bg-slate-950/95 light:bg-white/95 border border-slate-800 light:border-slate-200 p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 light:hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
                <MessageSquare className="w-4 h-4" />
                <span>Start College Discussion</span>
              </div>
              <h2 className="font-display font-black text-2xl text-slate-100 light:text-slate-900 tracking-tight">
                Ask a Question or Share Insights
              </h2>
            </div>

            {/* Choose public or anonymous identity for this post */}
            <div className="mb-5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 light:bg-slate-100 light:border-slate-200">
              <p className="text-xs font-bold text-slate-200 light:text-slate-900 mb-3">How do you want to post?</p>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setIsAnonymous(false)} className={`p-3 rounded-xl border text-left ${!isAnonymous ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 light:border-slate-300'}`}>
                  <span className="block text-sm font-bold text-slate-100 light:text-slate-900">Public profile</span>
                  <span className="block text-[11px] text-slate-400 mt-1">Show your real name, profile photo and role</span>
                </button>
                <button type="button" onClick={() => setIsAnonymous(true)} className={`p-3 rounded-xl border text-left ${isAnonymous ? 'border-orange-500 bg-orange-500/10' : 'border-slate-700 light:border-slate-300'}`}>
                  <span className="block text-sm font-bold text-slate-100 light:text-slate-900">Anonymous</span>
                  <span className="block text-[11px] text-slate-400 mt-1">Show only your public ID; hide your real name, photo and role</span>
                </button>
              </div>
              <div className="flex items-center gap-3 mt-3">
                {!isAnonymous && <AnimeAvatar avatarId={user?.avatar || 'avatar-1'} size="sm" />}
                <p className="text-[11px] text-slate-400">{isAnonymous ? 'Your public ID will be used as a pseudonym. Your real name, photo and role stay hidden; the platform still knows your account for moderation.' : `Your post will appear as ${user?.fullName || user?.name || user?.publicId || 'your name'}${user?.role ? ` · ${user.role}` : ''}. Your email is never displayed.`}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Channel Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1.5">
                  Select Channel
                </label>
                <select
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 light:bg-white light:border-slate-300 light:text-slate-900"
                >
                  {CHANNELS_DATA.map(c => (
                    <option key={c.id} value={c.id}>
                      #{c.slug} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1.5">
                  Discussion Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Can someone explain why sliding window works for this problem?"
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 light:bg-white light:border-slate-300 light:text-slate-900"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1.5">
                  Detailed Context / Code / Question
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share details, problem links, code snippets, or what approaches you've tried..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 light:bg-white light:border-slate-300 light:text-slate-900 resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1.5">
                  Add Tags
                </label>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1 font-mono"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-400 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Type tag (e.g. DynamicProgramming)..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 light:bg-white light:border-slate-300 light:text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white light:bg-slate-200 light:text-slate-800"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              {/* AI Moderation notice */}
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 light:bg-blue-50 light:text-blue-700 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Protected by MentorSphere AI Safety Shield (Anti-abuse & respectful learning filter).</span>
              </div>

              {/* Save error (nothing is shown as posted unless the server saved it) */}
              {submitError && (
                <div
                  role="alert"
                  className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 light:text-rose-700 flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl font-display font-bold text-xs text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <span>Checking content safety & posting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Publish Discussion</span>
                  </>
                )}
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
