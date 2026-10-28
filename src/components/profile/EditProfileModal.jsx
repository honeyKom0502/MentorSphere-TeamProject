import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Check, Plus, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { ANIME_AVATARS, AnimeAvatar } from '../../data/animeAvatars';
import { PRESET_SKILLS, PRESET_INTERESTS } from '../../data/mockData';
import { generateUniquePublicId, isValidPublicId } from '../../data/codenameGenerator';
import { SkillPill } from '../common/Badge';

export const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useNotifications();

  const [avatar, setAvatar] = useState(user?.avatar || 'avatar-1');
  const [publicId, setPublicId] = useState(user?.publicId || 'KnightRider');
  const [skills, setSkills] = useState(user?.skills || ['DSA', 'Python']);
  const [interests, setInterests] = useState(user?.interests || ['DSA & Problem Solving']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [bio, setBio] = useState(user?.bio || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [companyOrTrack, setCompanyOrTrack] = useState(user?.companyOrTrack || '');
  const [graduationYear, setGraduationYear] = useState(user?.graduationYear || '');
  const [profileVisibility, setProfileVisibility] = useState(user?.profileVisibility || 'public');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const toggleSkill = (s) => {
    if (skills.includes(s)) {
      if (skills.length <= 2) {
        showToast('You must maintain at least 2 skills on your profile', 'warning');
        return;
      }
      setSkills(skills.filter(item => item !== s));
    } else {
      setSkills([...skills, s]);
    }
  };

  const addCustomSkill = (e) => {
    e.preventDefault();
    if (!customSkillInput.trim()) return;
    const clean = customSkillInput.trim();
    if (!skills.includes(clean)) {
      setSkills([...skills, clean]);
    }
    setCustomSkillInput('');
  };

  const toggleInterest = (i) => {
    if (interests.includes(i)) {
      setInterests(interests.filter(item => item !== i));
    } else {
      setInterests([...interests, i]);
    }
  };

  const handleSave = async () => {
    if (!isValidPublicId(publicId)) {
      showToast('Public ID must be 3-20 characters (alphanumeric)', 'warning');
      return;
    }
    if (skills.length < 2) {
      showToast('Please select at least 2 skills', 'warning');
      return;
    }

    setSaving(true);
    const result = await updateProfile({
      avatar, publicId, skills, interests, bio, department, companyOrTrack,
      graduationYear: graduationYear ? Number(graduationYear) : null, profileVisibility
    });
    setSaving(false);
    if (!result?.success) {
      showToast(result?.message || 'Could not save profile changes.', 'error');
      return;
    }
    showToast('Profile updated successfully!', 'success');
    onClose();
  };

  return (
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
          className="relative w-full max-w-xl rounded-3xl glass-panel-elevated bg-slate-950/95 light:bg-white/95 border border-slate-800 light:border-slate-200 p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto space-y-5"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 light:hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>

          <div>
            <h2 className="font-display font-black text-2xl text-slate-100 light:text-slate-900 tracking-tight">
              Edit Student Cyber Profile
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Public posts and mentor profiles show your real name. Anonymous posts use your public ID as a pseudonym. Private profiles are hidden from Find Mentor.
            </p>
          </div>

          {/* Anime Avatar Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-2">
              Anime Avatar Studio
            </label>
            <div className="grid grid-cols-5 gap-2.5 max-h-44 overflow-y-auto p-1">
              {ANIME_AVATARS.map(av => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setAvatar(av.id)}
                  className={`flex flex-col items-center p-2 rounded-2xl border transition-all ${
                    avatar === av.id
                      ? 'bg-blue-600/30 border-blue-500 ring-2 ring-blue-500/50'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/50 light:bg-slate-50 light:border-slate-200'
                  }`}
                >
                  <AnimeAvatar avatarId={av.id} size="sm" showRing={false} />
                  <span className="text-[9px] font-bold text-slate-300 light:text-slate-700 mt-1 truncate max-w-full">
                    {av.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Public ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">
              Anonymous Public Codename
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={publicId}
                onChange={(e) => setPublicId(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-orange-500 light:bg-white light:border-slate-300 light:text-slate-900"
              />
              <button
                type="button"
                onClick={() => setPublicId(generateUniquePublicId())}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reroll
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={500} placeholder="Tell juniors what you can help with…" className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-100 light:bg-white light:border-slate-300 light:text-slate-900" rows={2}/>
            </div>
            <div><label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">Company / Career track</label><input value={companyOrTrack} onChange={e => setCompanyOrTrack(e.target.value)} maxLength={160} placeholder="e.g. Software Engineer" className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-100 light:bg-white light:border-slate-300 light:text-slate-900"/></div>
            <div><label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">Department / Domain</label><input value={department} onChange={e => setDepartment(e.target.value)} maxLength={120} placeholder="e.g. Backend / AI-ML" className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-100 light:bg-white light:border-slate-300 light:text-slate-900"/></div>
            <div><label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">Graduation year</label><input type="number" value={graduationYear} onChange={e => setGraduationYear(e.target.value)} min="1990" max="2100" placeholder="2027" className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-100 light:bg-white light:border-slate-300 light:text-slate-900"/></div>
            <div><label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1">Mentor profile visibility</label><select value={profileVisibility} onChange={e => setProfileVisibility(e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-100 light:bg-white light:border-slate-300 light:text-slate-900"><option value="public">Public — visible in Find Mentor</option><option value="private">Private — hidden from Find Mentor</option></select></div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 light:text-slate-700 mb-1.5">
              Verified Skills (Minimum 2)
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
              {PRESET_SKILLS.map(s => (
                <SkillPill
                  key={s}
                  skill={s}
                  active={skills.includes(s)}
                  onClick={() => toggleSkill(s)}
                />
              ))}
            </div>

            <form onSubmit={addCustomSkill} className="flex gap-2 mt-2">
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                placeholder="Add custom skill..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-100 light:bg-white light:border-slate-300 light:text-slate-900"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white light:bg-slate-200 light:text-slate-800"
              >
                Add
              </button>
            </form>
          </div>

          {/* Save Button */}
          <div className="pt-3 border-t border-slate-800 light:border-slate-200 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-800 light:hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl font-display font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20"
            >
              {saving ? 'Saving…' : 'Save Profile Changes'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
