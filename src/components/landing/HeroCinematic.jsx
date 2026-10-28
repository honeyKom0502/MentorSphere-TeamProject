import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Film } from 'lucide-react';
import { ParticleCanvas } from '../common/ParticleCanvas';

export const HeroCinematic = ({ onOpenSignup }) => {
  const [showVideoMode, setShowVideoMode] = useState(true);
  const videoRef = useRef(null);

  return (
    <section className="relative min-h-[92vh] pt-32 pb-24 flex flex-col justify-center items-center overflow-hidden bg-slate-950 dark:bg-slate-950 light:bg-slate-50 transition-colors duration-500">
      {/* Background Layer */}
      {showVideoMode ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            ref={videoRef}
            src="/media/hero_library.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-35 dark:opacity-25 light:opacity-15 transition-opacity duration-1000 scale-105"
          />
          {/* Vignette blend */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40 dark:from-slate-950 dark:via-slate-950/70 dark:to-slate-950/40 light:from-slate-50 light:via-slate-50/80 light:to-slate-50/60 pointer-events-none" />
        </div>
      ) : null}

      {/* Background Neural Particles */}
      <ParticleCanvas className="absolute inset-0 pointer-events-none z-1" />

      {/* Ambient Radial Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-br from-blue-600/20 via-orange-500/15 to-transparent dark:from-blue-600/20 light:from-blue-400/20 light:via-orange-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center my-auto flex flex-col items-center justify-center">
        
        {/* Top Badge & Film Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-blue-500/30 light:border-blue-300 text-sm font-bold text-blue-300 dark:text-blue-300 light:text-blue-700 shadow-xl light:shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 light:bg-orange-600 animate-ping" />
            <span>The Next-Gen College Mentorship Guild</span>
          </div>

          <button
            onClick={() => setShowVideoMode(!showVideoMode)}
            className="p-2.5 rounded-full bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-orange-500/40 light:border-orange-300 text-orange-400 light:text-orange-600 hover:bg-orange-500/20 transition-all flex items-center justify-center shadow-lg light:shadow-md"
            title="Toggle background video"
          >
            <Film className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Hero Title - High Contrast Light Mode */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-black text-6xl sm:text-8xl md:text-9xl tracking-tight text-slate-100 dark:text-slate-100 light:text-slate-900 leading-[1.05] mb-6"
        >
          Mentor<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-orange-500 to-amber-500 dark:from-blue-400 dark:via-orange-500 dark:to-amber-400 light:from-blue-700 light:via-orange-600 light:to-amber-600">Sphere</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-orange-400 dark:text-orange-400 light:text-orange-600 tracking-wide mb-6"
        >
          "Connect. Learn. Grow Together."
        </motion.p>

        {/* Supporting Subtitle with Clear Contrast */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base sm:text-xl md:text-2xl text-slate-300 dark:text-slate-300 light:text-slate-700 max-w-3xl mx-auto leading-relaxed mb-12 font-medium"
        >
          A student-powered mentorship and networking ecosystem connecting <strong className="text-blue-400 dark:text-blue-400 light:text-blue-700 font-bold">Juniors</strong>, <strong className="text-orange-400 dark:text-orange-400 light:text-orange-600 font-bold">Seniors</strong>, and <strong className="text-purple-400 dark:text-purple-400 light:text-purple-700 font-bold">Alumni</strong> in engineering colleges.
        </motion.p>

        {/* Centered Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center"
        >
          <button
            onClick={onOpenSignup}
            className="px-10 py-5 rounded-2xl font-display font-bold text-base sm:text-lg text-white bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 hover:from-blue-500 hover:to-orange-400 shadow-2xl shadow-blue-500/30 flex items-center gap-3.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </motion.div>

      </div>
    </section>
  );
};