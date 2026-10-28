import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Users, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { AnimeAvatar } from '../../data/animeAvatars';
import { RoleBadge } from '../common/Badge';
import { moderationService } from '../../services/moderationService';
import { ModerationAlert } from '../discussions/ModerationAlert';

export const AskMentorModal = ({ mentor, isOpen, onClose }) => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState('DSA & Placement Strategy');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Moderation
  const [modAlert, setModAlert] = useState({ isOpen: false, reason: '', message: '' });

  if (!isOpen || !mentor) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      showToast('Please type your question or request', 'warning');
      return;
    }

    setIsSubmitting(true);

    // AI Moderation check
    const check = await moderationService.evaluateMessage(message);
    if (!check.isClean) {
      setIsSubmitting(false);
      setModAlert({
        isOpen: true,
        reason: check.flaggedReason,
        message: check.friendlyMessage
      });
      return;
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setMessage('');
      showToast(`Mentorship request sent to ${mentor.publicId}! They will be notified.`, 'success');
      onClose();
    }, 400);
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
            className="relative w-full max-w-lg rounded-3xl glass-panel-elevated bg-slate-950/95 light:bg-white/95 border border-slate-800 light:border-slate-200 p-6 md:p-8 shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 light:hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Mentor Header */}
            <div className="flex items-center gap-3.5 pb-4 mb-4 border-b border-slate-800 light:border-slate-200">
              <AnimeAvatar avatarId={mentor.avatar} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-lg text-slate-100 light:text-slate-900">
                    {mentor.publicId}
                  </h3>
                  <RoleBadge role={mentor.role} size="sm" />
                </div>
                <p className="text-xs text-orange-400 font-semibold">{mentor.companyOrTrack}</p>
                <p className="text-[11px] text-slate-400">{mentor.department}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1.5">
                  Guidance Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 light:bg-white light:border-slate-300 light:text-slate-900"
                >
                  <option>DSA & Placement Strategy</option>
                  <option>Resume Review & Profile Roast</option>
                  <option>Project Architecture & Web Dev</option>
                  <option>Off-Campus Applications & Referrals</option>
                  <option>Higher Studies / MS in USA</option>
                  <option>General Academic Guidance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1.5">
                  Your Question / Context
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce what you are working on, where you are stuck, or what advice you need..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 light:bg-white light:border-slate-300 light:text-slate-900 resize-none"
                />
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800 light:bg-slate-50 light:border-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Sent from your anonymous ID <strong>{user?.publicId}</strong>. Real name is never revealed.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl font-display font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
              >
                {isSubmitting ? (
                  <span>Sending request...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Mentorship Dispatch</span>
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
