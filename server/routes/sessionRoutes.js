import express from 'express';
import mongoose from 'mongoose';
import crypto from 'node:crypto';
import User from '../models/User.js';
import MentorshipSession from '../models/MentorshipSession.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth);
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ success: false, message: 'Database unavailable.' });
  next();
});

const serialize = (s) => ({
  id: String(s._id), title: s.title, goal: s.goal, scheduledAt: new Date(s.scheduledAt).toISOString(),
  durationMinutes: s.durationMinutes, status: s.status, notes: s.notes || '', actionItems: s.actionItems || [],
  boardNodes: s.boardNodes || [], roomKey: s.roomKey,
  createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : null,
  updatedAt: s.updatedAt ? new Date(s.updatedAt).toISOString() : null,
  mentor: s.mentor && typeof s.mentor === 'object' ? { id: String(s.mentor._id), name: s.mentor.fullName, publicId: s.mentor.publicId, role: s.mentor.role } : null,
  junior: s.junior && typeof s.junior === 'object' ? { id: String(s.junior._id), name: s.junior.fullName, publicId: s.junior.publicId, role: s.junior.role } : null,
  isMentor: String(s.mentor?._id || s.mentor) === String(s._viewerId || '')
});
const populate = (query) => query.populate('mentor', 'fullName publicId role').populate('junior', 'fullName publicId role');

router.get('/mentors', async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id }, role: { $in: ['Senior', 'Alumni'] }, emailVerified: true })
      .select('fullName publicId role avatar skills interests').sort({ role: 1, fullName: 1 }).limit(100).lean();
    res.json({ success: true, mentors: users.map(u => ({ id: String(u._id), name: u.fullName, publicId: u.publicId || 'Mentor', role: u.role, avatar: u.avatar, skills: u.skills || [], interests: u.interests || [] })) });
  } catch { res.status(500).json({ success: false, message: 'Unable to load mentors.' }); }
});

router.get('/', async (req, res) => {
  try {
    const docs = await populate(MentorshipSession.find({ $or: [{ mentor: req.user._id }, { junior: req.user._id }] }).sort({ scheduledAt: 1 }).limit(100)).lean();
    res.json({ success: true, sessions: docs.map(d => ({ ...serialize(d), isMentor: String(d.mentor?._id) === String(req.user._id) })) });
  } catch { res.status(500).json({ success: false, message: 'Unable to load sessions.' }); }
});

router.post('/', async (req, res) => {
  try {
    const { mentorId, title, goal = '', scheduledAt, durationMinutes = 30 } = req.body || {};
    if (!mongoose.Types.ObjectId.isValid(mentorId)) return res.status(400).json({ success: false, message: 'Choose a valid mentor.' });
    if (String(mentorId) === String(req.user._id)) return res.status(400).json({ success: false, message: 'You cannot book a session with yourself.' });
    if (typeof title !== 'string' || !title.trim() || title.trim().length > 120) return res.status(400).json({ success: false, message: 'Enter a session topic (max 120 characters).' });
    const date = new Date(scheduledAt);
    if (!scheduledAt || Number.isNaN(date.getTime()) || date.getTime() < Date.now() + 5 * 60 * 1000) return res.status(400).json({ success: false, message: 'Choose a future time at least 5 minutes from now.' });
    if (![15, 30, 45, 60].includes(Number(durationMinutes))) return res.status(400).json({ success: false, message: 'Choose a valid duration.' });
    const mentor = await User.findOne({ _id: mentorId, role: { $in: ['Senior', 'Alumni'] }, emailVerified: true }).select('_id');
    if (!mentor) return res.status(404).json({ success: false, message: 'That mentor is not available.' });
    const created = await MentorshipSession.create({ mentor: mentor._id, junior: req.user._id, title: title.trim(), goal: String(goal).slice(0, 1500), scheduledAt: date, durationMinutes: Number(durationMinutes), roomKey: crypto.randomBytes(12).toString('hex') });
    const doc = await populate(MentorshipSession.findById(created._id)).lean();
    res.status(201).json({ success: true, session: { ...serialize(doc), isMentor: false } });
  } catch (error) {
    console.error('Create session error:', error.message);
    res.status(500).json({ success: false, message: 'Unable to book this session.' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ success: false, message: 'Session not found.' });
    const session = await MentorshipSession.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found.' });
    const viewer = String(req.user._id), mentor = String(session.mentor), junior = String(session.junior);
    if (viewer !== mentor && viewer !== junior) return res.status(403).json({ success: false, message: 'You are not part of this session.' });
    const { action } = req.body || {};
    if (action === 'accept' || action === 'decline') {
      if (viewer !== mentor) return res.status(403).json({ success: false, message: 'Only the invited mentor can respond.' });
      if (session.status !== 'pending') return res.status(409).json({ success: false, message: 'This request has already been processed.' });
      session.status = action === 'accept' ? 'accepted' : 'declined';
    } else if (action === 'cancel') {
      if (!['pending', 'accepted'].includes(session.status)) return res.status(409).json({ success: false, message: 'This session can no longer be cancelled.' });
      session.status = 'cancelled';
    } else if (action === 'complete') {
      if (viewer !== mentor) return res.status(403).json({ success: false, message: 'Only the mentor can complete this session.' });
      if (session.status !== 'accepted') return res.status(409).json({ success: false, message: 'Only accepted sessions can be completed.' });
      session.status = 'completed';
    } else if (action === 'update-workspace') {
      if (session.status !== 'accepted') return res.status(409).json({ success: false, message: 'Accept the session before editing its workspace.' });
      if (req.body.notes !== undefined) session.notes = String(req.body.notes).slice(0, 5000);
      if (req.body.boardNodes !== undefined) {
        if (!Array.isArray(req.body.boardNodes) || req.body.boardNodes.length > 40) return res.status(400).json({ success: false, message: 'A roadmap can contain up to 40 steps.' });
        session.boardNodes = req.body.boardNodes.map((n, i) => ({ id: String(n.id || `step-${i}`).slice(0, 80), title: String(n.title || 'Untitled step').trim().slice(0, 120), description: String(n.description || '').slice(0, 500), color: ['blue','orange','green','purple'].includes(n.color) ? n.color : 'blue', order: i }));
      }
      if (req.body.actionItems !== undefined) {
        if (!Array.isArray(req.body.actionItems) || req.body.actionItems.length > 30) return res.status(400).json({ success: false, message: 'Use up to 30 action items.' });
        session.actionItems = req.body.actionItems.map(x => String(x).trim().slice(0, 200)).filter(Boolean);
      }
    } else return res.status(400).json({ success: false, message: 'Unknown session action.' });
    await session.save();
    const doc = await populate(MentorshipSession.findById(session._id)).lean();
    res.json({ success: true, session: { ...serialize(doc), isMentor: String(doc.mentor?._id) === viewer } });
  } catch (error) {
    console.error('Update session error:', error.message);
    res.status(500).json({ success: false, message: 'Unable to update this session.' });
  }
});

export default router;
