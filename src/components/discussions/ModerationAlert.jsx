import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Sparkles, X, CheckCircle2 } from 'lucide-react';

export const ModerationAlert = ({ isOpen, reason, friendlyMessage, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md rounded-3xl glass-panel-elevated bg-slate-950/95 light:bg-white/95 border-2 border-orange-500/50 p-6 md:p-8 shadow-2xl text-center overflow-hidden"
        >
          {/* Ambient warning aura */}
          <div className="absolute -top-20 inset-x-0 h-40 bg-orange-500/20 blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 light:hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Shield Icon */}
          <div className="inline-flex p-3.5 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400 mb-4 shadow-lg shadow-orange-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h3 className="font-display font-black text-xl text-slate-100 light:text-slate-900 tracking-tight mb-2">
            Safety & Respect Policy
          </h3>

          <p className="text-sm font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 p-3 rounded-2xl mb-3">
            "{friendlyMessage || "Let's keep MentorSphere respectful. Please rephrase your message."}"
          </p>

          <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed mb-6">
            MentorSphere is a positive, supportive peer ecosystem for all college students. To protect students from harassment and bullying, our AI moderation automatically blocks abusive terms and aggressive shouting.
          </p>

          <div className="space-y-2">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl font-display font-bold text-xs text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 shadow-md shadow-orange-500/25 transition-transform hover:scale-[1.01]"
            >
              I Understand & Will Rephrase
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
