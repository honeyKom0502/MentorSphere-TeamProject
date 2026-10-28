

import React, { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import {

  X,

  ArrowRight,

  ArrowLeft,

  Check,

  User,

  Mail,

  Lock,

  ShieldCheck,

  RefreshCw,

  GraduationCap,

  Briefcase,

  Plus

} from 'lucide-react';

import confetti from 'canvas-confetti';

import { useAuth } from '../../context/AuthContext';

import { useNotifications } from '../../context/NotificationContext';

import {

  ANIME_AVATARS,

  AnimeAvatar

} from '../../data/animeAvatars';

import {

  PRESET_SKILLS,

  PRESET_INTERESTS

} from '../../data/mockData';

import {

  generateUniquePublicId,

  isValidPublicId

} from '../../data/codenameGenerator';

import { SkillPill } from '../common/Badge';

export const SignupModal = ({

  isOpen,

  onClose,

  onSwitchToLogin

}) => {

  const { signup, verifyOTP } = useAuth();

  const { showToast } = useNotifications();

  // Current Step:

  // 1 = Account

  // 2 = Skills

  // 3 = Interests

  // 4 = Anime Avatar

  // 5 = Public ID

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');

  // Form State

  const [fullName, setFullName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [role, setRole] = useState('Junior');

  const [selectedSkills, setSelectedSkills] = useState([

    'DSA',

    'Python'

  ]);

  const [customSkillInput, setCustomSkillInput] = useState('');

  const [selectedInterests, setSelectedInterests] = useState([

    'DSA & Problem Solving',

    'Placements Preparation'

  ]);

  const [selectedAvatar, setSelectedAvatar] = useState('avatar-1');

  const [publicId, setPublicId] = useState(() =>

    generateUniquePublicId()

  );

  if (!isOpen) return null;

  // Handle Next / Signup

  const handleNext = async () => {
    // STEP 6 - EMAIL VERIFICATION
    if (step === 6) {
      if (!/^\d{6}$/.test(otp)) {
        showToast('Please enter the 6-digit OTP.', 'warning');
        return;
      }

      const result = await verifyOTP(email, otp);
      if (!result?.success) {
        showToast(result?.message || 'OTP verification failed. Please try again.', 'error');
        return;
      }

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      showToast('Email verified! Welcome to MentorSphere.', 'success');
      onClose();
      return;
    }

    // STEP 1

    if (step === 1) {

      if (!fullName.trim()) {

        showToast(

          'Please enter your full name',

          'warning'

        );

        return;

      }

      if (!email.trim() || !email.includes('@')) {

        showToast(

          'Please enter a valid college email address',

          'warning'

        );

        return;

      }

      if (!password || password.length < 6) {

        showToast(

          'Password must be at least 6 characters',

          'warning'

        );

        return;

      }

      setStep(2);

      return;

    }

    // STEP 2

    if (step === 2) {

      if (selectedSkills.length < 2) {

        showToast(

          'Please select at least 2 skills to continue',

          'warning'

        );

        return;

      }

      setStep(3);

      return;

    }

    // STEP 3

    if (step === 3) {

      if (selectedInterests.length < 1) {

        showToast(

          'Please select at least 1 interest to customize your feed',

          'warning'

        );

        return;

      }

      setStep(4);

      return;

    }

    // STEP 4

    if (step === 4) {

      setStep(5);

      return;

    }

    // STEP 5 - FINAL SIGNUP

    if (step === 5) {

      if (!isValidPublicId(publicId)) {

        showToast(

          'Public ID must be 3-20 characters (letters, numbers, underscores)',

          'warning'

        );

        return;

      }

      try {

        // Send complete signup data to AuthContext

        const result = await signup({

          fullName,

          email,

          password,

          role,

          skills: selectedSkills,

          interests: selectedInterests,

          avatar: selectedAvatar,

          publicId

        });

        // If backend/signup failed

        if (!result || !result.success) {

          showToast(

            result?.message || 'Signup failed. Please try again.',

            'error'

          );

          return;

        }

        // Signup successful

        confetti({

          particleCount: 100,

          spread: 70,

          origin: { y: 0.6 }

        });

        setOtp('');
        setStep(6);
        showToast('OTP sent! Please check your email.', 'success');

      } catch (error) {

        console.error('Signup error:', error);

        showToast(

          'Unable to connect to the server. Please try again.',

          'error'

        );

      }

    }

  };

  // Toggle Skill

  const toggleSkill = (skill) => {

    if (selectedSkills.includes(skill)) {

      setSelectedSkills(

        selectedSkills.filter(

          (s) => s !== skill

        )

      );

    } else {

      setSelectedSkills([

        ...selectedSkills,

        skill

      ]);

    }

  };

  // Add Custom Skill

  const addCustomSkill = (e) => {

    e.preventDefault();

    if (!customSkillInput.trim()) return;

    const clean = customSkillInput.trim();

    if (!selectedSkills.includes(clean)) {

      setSelectedSkills([

        ...selectedSkills,

        clean

      ]);

    }

    setCustomSkillInput('');

  };

  // Toggle Interest

  const toggleInterest = (interest) => {

    if (selectedInterests.includes(interest)) {

      setSelectedInterests(

        selectedInterests.filter(

          (i) => i !== interest

        )

      );

    } else {

      setSelectedInterests([

        ...selectedInterests,

        interest

      ]);

    }

  };

  // Generate New Public ID

  const randomizePublicId = () => {

    setPublicId(generateUniquePublicId());

  };

  return (

    <AnimatePresence>

      <div

        onClick={onClose}

        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"

      >

        <motion.div

          onClick={(e) => e.stopPropagation()}

          initial={{

            opacity: 0,

            scale: 0.95,

            y: 20

          }}

          animate={{

            opacity: 1,

            scale: 1,

            y: 0

          }}

          exit={{

            opacity: 0,

            scale: 0.95,

            y: 20

          }}

          className="relative w-full max-w-xl rounded-3xl glass-panel-elevated bg-slate-950/95 light:bg-white/95 border border-slate-800 light:border-slate-200 p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"

        >

          {/* Ambient Lighting */}

          <div className="absolute -top-24 -right-24 w-52 h-52 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

          <div className="absolute -bottom-24 -left-24 w-52 h-52 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />

          {/* Close Button */}

          <button

            onClick={onClose}

            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 light:hover:bg-slate-100 transition-colors"

          >

            <X className="w-5 h-5" />

          </button>

          {/* Stepper */}

          <div className="flex items-center justify-between mb-6 pr-8">

            <div className="flex items-center gap-1.5">

              {[1, 2, 3, 4, 5, 6].map((i) => (

                <div

                  key={i}

                  className={`h-1.5 rounded-full transition-all duration-300 ${

                    i === step

                      ? 'w-8 bg-orange-500'

                      : i < step

                        ? 'w-4 bg-blue-500'

                        : 'w-4 bg-slate-800 light:bg-slate-300'

                  }`}

                />

              ))}

            </div>

            <span className="text-xs font-bold text-slate-400 tracking-wider">

              STEP {step} OF 6

            </span>

          </div>

          {/* STEP 1 */}

          {step === 1 && (

            <motion.div

              initial={{ opacity: 0, x: 20 }}

              animate={{ opacity: 1, x: 0 }}

              exit={{ opacity: 0, x: -20 }}

              className="space-y-4"

            >

              <div>

                <h2 className="font-display font-black text-2xl text-slate-100 light:text-slate-900 tracking-tight">

                  Join MentorSphere

                </h2>

                <p className="text-xs text-slate-400 mt-1">

                  Start by creating your account and choosing your role in the college network.

                </p>

              </div>

              {/* Role Selection */}

              <div>

                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-2">

                  Select Your College Role:

                </label>

                <div className="grid grid-cols-3 gap-2.5">

                  {[

                    {

                      id: 'Junior',

                      icon: User,

                      desc: '1st & 2nd year student'

                    },

                    {

                      id: 'Senior',

                      icon: GraduationCap,

                      desc: '3rd & 4th year student'

                    },

                    {

                      id: 'Alumni',

                      icon: Briefcase,

                      desc: 'Graduated / Working'

                    }

                  ].map((r) => {

                    const Icon = r.icon;

                    const isSelected = role === r.id;

                    return (

                      <button

                        key={r.id}

                        type="button"

                        onClick={() => setRole(r.id)}

                        className={`p-3 rounded-2xl border text-left transition-all ${

                          isSelected

                            ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/20 light:bg-blue-50'

                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 light:bg-slate-50 light:border-slate-200'

                        }`}

                      >

                        <div className="flex items-center justify-between mb-1">

                          <Icon

                            className={`w-4 h-4 ${

                              isSelected

                                ? 'text-blue-400'

                                : 'text-slate-400'

                            }`}

                          />

                          {isSelected && (

                            <Check className="w-3.5 h-3.5 text-blue-400" />

                          )}

                        </div>

                        <span

                          className={`text-xs font-bold block ${

                            isSelected

                              ? 'text-blue-300 light:text-blue-700'

                              : 'text-slate-200 light:text-slate-800'

                          }`}

                        >

                          {r.id}

                        </span>

                        <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">

                          {r.desc}

                        </span>

                      </button>

                    );

                  })}

                </div>

              </div>

              {/* Form Fields */}

              <div className="space-y-3 pt-1">

                {/* Full Name */}

                <div>

                  <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">

                    Full Name

                    <span className="text-slate-500 font-normal">

                      {' '}(Private — Never shown in discussions)

                    </span>

                  </label>

                  <div className="relative">

                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                    <input

                      type="text"

                      value={fullName}

                      onChange={(e) =>

                        setFullName(e.target.value)

                      }

                      placeholder="e.g. Bhavini Singh"

                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 light:bg-white light:border-slate-300 light:text-slate-900"

                    />

                  </div>

                </div>

                {/* Email */}

                <div>

                  <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">

                    College Email ID

                  </label>

                  <div className="relative">

                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                    <input

                      type="email"

                      value={email}

                      onChange={(e) =>

                        setEmail(e.target.value)

                      }

                      placeholder="bhavini.singh@college.edu"

                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 light:bg-white light:border-slate-300 light:text-slate-900"

                    />

                  </div>

                </div>

                {/* Password */}

                <div>

                  <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">

                    Create Password

                  </label>

                  <div className="relative">

                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                    <input

                      type="password"

                      value={password}

                      onChange={(e) =>

                        setPassword(e.target.value)

                      }

                      placeholder="Minimum 6 characters"

                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 light:bg-white light:border-slate-300 light:text-slate-900"

                    />

                  </div>

                </div>

              </div>

            </motion.div>

          )}

          {/* STEP 2 */}

          {step === 2 && (

            <motion.div

              initial={{ opacity: 0, x: 20 }}

              animate={{ opacity: 1, x: 0 }}

              exit={{ opacity: 0, x: -20 }}

              className="space-y-4"

            >

              <div>

                <h2 className="font-display font-black text-2xl text-slate-100 light:text-slate-900 tracking-tight">

                  What are your Skills?

                </h2>

                <p className="text-xs text-slate-400 mt-1">

                  Select at least{' '}

                  <strong className="text-orange-400">

                    2 skills

                  </strong>{' '}

                  you possess or are currently learning.

                </p>

              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 light:bg-blue-50 light:text-blue-700">

                <span>

                  Selected Skills:{' '}

                  <strong>

                    {selectedSkills.length}

                  </strong>

                </span>

                <span>

                  {selectedSkills.length >= 2

                    ? '✅ Requirement met'

                    : '⚠️ Need at least 2'}

                </span>

              </div>

              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">

                {PRESET_SKILLS.map((skill) => (

                  <SkillPill

                    key={skill}

                    skill={skill}

                    active={selectedSkills.includes(skill)}

                    onClick={() => toggleSkill(skill)}

                  />

                ))}

              </div>

              <form

                onSubmit={addCustomSkill}

                className="flex gap-2 pt-2"

              >

                <input

                  type="text"

                  value={customSkillInput}

                  onChange={(e) =>

                    setCustomSkillInput(e.target.value)

                  }

                  placeholder="Add custom skill (e.g. Flutter, Rust)..."

                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 light:bg-white light:border-slate-300 light:text-slate-900"

                />

                <button

                  type="submit"

                  className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white light:bg-slate-200 light:text-slate-800 flex items-center gap-1"

                >

                  <Plus className="w-3.5 h-3.5" />

                  Add

                </button>

              </form>

            </motion.div>

          )}

          {/* STEP 3 */}

          {step === 3 && (

            <motion.div

              initial={{ opacity: 0, x: 20 }}

              animate={{ opacity: 1, x: 0 }}

              exit={{ opacity: 1, x: -20 }}

              className="space-y-4"

            >

              <div>

                <h2 className="font-display font-black text-2xl text-slate-100 light:text-slate-900 tracking-tight">

                  What are you interested in?

                </h2>

                <p className="text-xs text-slate-400 mt-1">

                  We'll customize your channel recommendations, mentor suggestions, and discussion feed.

                </p>

              </div>

              <div className="grid grid-cols-2 gap-2.5 max-h-60 overflow-y-auto p-1">

                {PRESET_INTERESTS.map((interest) => {

                  const isSelected =

                    selectedInterests.includes(interest);

                  return (

                    <button

                      key={interest}

                      type="button"

                      onClick={() =>

                        toggleInterest(interest)

                      }

                      className={`p-3 rounded-2xl border text-left transition-all ${

                        isSelected

                          ? 'bg-orange-500/20 border-orange-500/60 text-orange-200 light:bg-orange-50 light:text-orange-900 light:border-orange-300'

                          : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700 light:bg-slate-50 light:border-slate-200 light:text-slate-700'

                      }`}

                    >

                      <div className="flex items-center justify-between">

                        <span className="text-xs font-semibold">

                          {interest}

                        </span>

                        {isSelected && (

                          <Check className="w-3.5 h-3.5 text-orange-400" />

                        )}

                      </div>

                    </button>

                  );

                })}

              </div>

            </motion.div>

          )}

          {/* STEP 4 */}

          {step === 4 && (

            <motion.div

              initial={{ opacity: 0, x: 20 }}

              animate={{ opacity: 1, x: 0 }}

              exit={{ opacity: 0, x: -20 }}

              className="space-y-4"

            >

              <div>

                <h2 className="font-display font-black text-2xl text-slate-100 light:text-slate-900 tracking-tight">

                  Choose Your Anime Avatar

                </h2>

                <p className="text-xs text-slate-400 mt-1">

                  For your safety and anti-bullying protection, real photos are disabled. Pick your cyber avatar!

                </p>

              </div>

              <div className="grid grid-cols-5 gap-3 p-1 max-h-64 overflow-y-auto">

                {ANIME_AVATARS.map((av) => {

                  const isSelected =

                    selectedAvatar === av.id;

                  return (

                    <button

                      key={av.id}

                      type="button"

                      onClick={() =>

                        setSelectedAvatar(av.id)

                      }

                      className={`flex flex-col items-center p-2.5 rounded-2xl border transition-all ${

                        isSelected

                          ? 'bg-blue-600/30 border-blue-500 ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20'

                          : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700 light:bg-slate-50 light:border-slate-200'

                      }`}

                    >

                      <AnimeAvatar

                        avatarId={av.id}

                        size="md"

                        showRing={false}

                      />

                      <span className="text-[10px] font-bold text-slate-300 light:text-slate-700 mt-1.5 truncate max-w-full">

                        {av.name}

                      </span>

                    </button>

                  );

                })}

              </div>

              {selectedAvatar && (

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 light:bg-slate-100 light:border-slate-200">

                  <AnimeAvatar

                    avatarId={selectedAvatar}

                    size="md"

                  />

                  <div className="flex-1 min-w-0">

                    <h4 className="text-xs font-bold text-slate-100 light:text-slate-900">

                      {

                        ANIME_AVATARS.find(

                          (a) => a.id === selectedAvatar

                        )?.name

                      }

                    </h4>

                    <p className="text-[11px] text-slate-400 leading-snug">

                      {

                        ANIME_AVATARS.find(

                          (a) => a.id === selectedAvatar

                        )?.description

                      }

                    </p>

                  </div>

                </div>

              )}

            </motion.div>

          )}

          {/* STEP 5 */}

          {step === 5 && (

            <motion.div

              initial={{ opacity: 0, x: 20 }}

              animate={{ opacity: 1, x: 0 }}

              exit={{ opacity: 1, x: -20 }}

              className="space-y-4"

            >

              <div>

                <h2 className="font-display font-black text-2xl text-slate-100 light:text-slate-900 tracking-tight">

                  Your Anonymous Public ID

                </h2>

                <p className="text-xs text-slate-400 mt-1">

                  This unique codename is what peers see in discussions. Your real name (

                  <span className="text-blue-400">

                    {fullName}

                  </span>

                  ) will stay 100% private!

                </p>

              </div>

              <div className="p-6 rounded-3xl glass-panel bg-slate-900/80 border-2 border-orange-500/40 text-center relative overflow-hidden shadow-xl light:bg-slate-50 light:border-orange-300">

                <div className="inline-block mb-3">

                  <AnimeAvatar

                    avatarId={selectedAvatar}

                    size="lg"

                  />

                </div>

                <div className="flex items-center justify-center gap-2">

                  <span className="font-display font-black text-2xl tracking-wide text-orange-400">

                    {publicId || 'YourCodename'}

                  </span>

                  <ShieldCheck className="w-5 h-5 text-blue-400" />

                </div>

                <p className="text-xs text-slate-400 mt-1 font-mono">

                  Role:{' '}

                  <strong className="text-slate-200 light:text-slate-800">

                    {role}

                  </strong>

                </p>

              </div>

              <div className="flex gap-2">

                <div className="relative flex-1">

                  <input

                    type="text"

                    value={publicId}

                    onChange={(e) =>

                      setPublicId(

                        e.target.value.replace(

                          /[^a-zA-Z0-9\\\_-]/g,

                          ''

                        )

                      )

                    }

                    placeholder="Enter custom codename..."

                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-orange-500 light:bg-white light:border-slate-300 light:text-slate-900 font-mono"

                  />

                </div>

                <button

                  type="button"

                  onClick={randomizePublicId}

                  className="px-4 py-2.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"

                  title="Generate another cool codename"

                >

                  <RefreshCw className="w-3.5 h-3.5" />

                  Reroll

                </button>

              </div>

            </motion.div>

          )}

          {/* STEP 6 - VERIFY EMAIL */}
          {step === 6 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="font-display font-black text-2xl text-slate-100 light:text-slate-900 tracking-tight">
                  Verify Your Email
                </h2>
                <p className="text-sm text-slate-400 mt-2">
                  Enter the 6-digit verification code sent to {email}.
                  The code expires in 10 minutes.
                </p>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 light:text-slate-700">
                  Email verification code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-center text-xl tracking-[0.4em] light:bg-white light:border-slate-300 light:text-slate-900"
                />
              </div>
              <p className="text-xs text-slate-400">
                Check your inbox and Spam/Junk folder if you cannot find the email.
              </p>
            </motion.div>
          )}

          {/* Bottom Navigation */}

          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800/80 light:border-slate-200">

            {step > 1 ? (

              <button

                type="button"

                onClick={() => {
                  if (step !== 6) setStep(step - 1);
                }}

                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-800 light:hover:bg-slate-100 flex items-center gap-1.5 transition-colors"

              >

                <ArrowLeft className="w-4 h-4" />

                Back

              </button>

            ) : (

              <div className="text-xs text-slate-400">

                Already registered?{' '}

                <button

                  onClick={() => {

                    onClose();

                    onSwitchToLogin();

                  }}

                  className="font-bold text-blue-400 hover:underline"

                >

                  Sign In

                </button>

              </div>

            )}

            <button

              type="button"

              onClick={handleNext}

              className="px-6 py-2.5 rounded-xl text-xs font-bold font-display text-white bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-105"

            >

              <span>

                {step === 6
                  ? 'Verify Email'
                  : step === 5
                    ? 'Create Account'
                    : 'Continue'}

              </span>

              <ArrowRight className="w-4 h-4" />

            </button>

          </div>

        </motion.div>

      </div>

    </AnimatePresence>

  );

};
