import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth);

const serialize = (u, currentUserId) => ({
  id: String(u._id),
  fullName: u.fullName || 'Mentor',
  role: u.role,
  avatar: u.avatar || 'avatar-1',
  bio: u.bio || '',
  department: u.department || '',
  companyOrTrack: u.companyOrTrack || '',
  graduationYear: u.graduationYear || null,
  skills: u.skills || [],
  interests: u.interests || [],
  isConnected: (u.connectedUsers || []).some(id => String(id) === currentUserId)
    && !(u.connectionRequests || []).some(id => String(id) === currentUserId),
  requestPending: (u.connectionRequests || []).some(id => String(id) === currentUserId)
    && !(u.connectedUsers || []).some(id => String(id) === currentUserId)
});

// GET /api/mentors?q=java&role=Senior
router.get('/', async (req, res) => {
  try {
    const currentId = String(req.user._id);
    const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 100) : '';
    const role = ['Senior', 'Alumni'].includes(req.query.role) ? req.query.role : null;
    const filter = {
      _id: { $ne: req.user._id },
      email: { $ne: req.user.email },
      role: role ? role : { $in: ['Senior', 'Alumni'] },
      profileVisibility: { $ne: 'private' },
      emailVerified: { $ne: false }
    };
    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      filter.$or = [
        { fullName: regex }, { bio: regex }, { department: regex },
        { companyOrTrack: regex }, { skills: regex }, { interests: regex }
      ];
    }
    const users = await User.find(filter)
      .select('fullName role avatar bio department companyOrTrack graduationYear skills interests connectedUsers connectionRequests')
      .sort({ role: 1, publicId: 1 }).limit(100).lean();
    return res.json({ success: true, mentors: users.map(u => serialize(u, currentId)) });
  } catch (error) {
    console.error('Mentor directory error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to search mentors right now.' });
  }
});


// GET /api/mentors/requests — incoming requests for the authenticated mentor.
router.get('/requests', async (req, res) => {
  try {
    // Reload the recipient from MongoDB, then resolve the requester IDs from its pending list.
    const recipient = await User.findById(req.user._id).select('connectionRequests').lean();
    const requesterIds = (recipient?.connectionRequests || []).map(String);
    const users = requesterIds.length ? await User.find({
      _id: { $in: requesterIds },
      emailVerified: { $ne: false }
    }).select('fullName role avatar bio department companyOrTrack graduationYear skills interests profileVisibility').lean() : [];
    return res.json({
      success: true,
      requests: users.map(u => ({
        id: String(u._id), fullName: u.fullName || 'Student', role: u.role,
        avatar: u.avatar || 'avatar-1', bio: u.bio || '',
        department: u.department || '', companyOrTrack: u.companyOrTrack || '',
        graduationYear: u.graduationYear || null, skills: u.skills || [], interests: u.interests || []
      }))
    });
  } catch (error) {
    console.error('Load connection requests error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to load connection requests.' });
  }
});

// GET /api/mentors/connections — all accepted connections for either side.
router.get('/connections', async (req, res) => {
  try {
    const ids = (req.user.connectedUsers || []).map(String);
    const users = ids.length ? await User.find({
      _id: { $in: ids }, emailVerified: { $ne: false }
    }).select('fullName role avatar bio department companyOrTrack graduationYear skills interests profileVisibility').lean() : [];
    return res.json({
      success: true,
      connections: users.map(u => ({
        id: String(u._id), fullName: u.fullName || 'Member', role: u.role,
        avatar: u.avatar || 'avatar-1', bio: u.bio || '',
        department: u.department || '', companyOrTrack: u.companyOrTrack || '',
        graduationYear: u.graduationYear || null, skills: u.skills || [], interests: u.interests || [],
        isConnected: true
      }))
    });
  } catch (error) {
    console.error('Load connections error:', error.message);
    return res.status(500).json({ success: false, message: 'Unable to load connections.' });
  }
});

// GET /api/mentors/:id
router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ success: false, message: 'Profile not found.' });
  }
  const user = await User.findOne({ _id: req.params.id, profileVisibility: { $ne: 'private' }, role: { $in: ['Senior', 'Alumni'] } })
    .select('fullName role avatar bio department companyOrTrack graduationYear skills interests connectedUsers connectionRequests').lean();
  if (!user) return res.status(404).json({ success: false, message: 'Profile not found or private.' });
  return res.json({ success: true, mentor: serialize(user, String(req.user._id)) });
});

// POST /api/mentors/:id/connect
router.post('/:id/connect', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id) || String(req.user._id) === req.params.id) {
      return res.status(400).json({ success: false, message: 'Invalid mentor.' });
    }
    const mentor = await User.findOne({ _id: req.params.id, role: { $in: ['Senior', 'Alumni'] }, profileVisibility: { $ne: 'private' } });
    if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found or profile is private.' });
    const alreadyConnected = (mentor.connectedUsers || []).some(id => String(id) === String(req.user._id));
    const pending = (mentor.connectionRequests || []).some(id => String(id) === String(req.user._id));
    if (!alreadyConnected && !pending) {
      mentor.connectionRequests.push(req.user._id);
      await mentor.save();
    }
    return res.json({
      success: true,
      requestPending: !alreadyConnected,
      isConnected: alreadyConnected,
      message: alreadyConnected ? 'You are already connected.' : pending ? 'Your request is already pending.' : 'Connection request sent.'
    });
  } catch (error) {
    console.error('Mentor connect error:', error.message);
    return res.status(500).json({ success: false, message: 'Could not send connection request.' });
  }
});


// POST /api/mentors/:id/respond — accept or reject a request received by the logged-in user.
router.post('/:id/respond', async (req, res) => {
  try {
    const requesterId = req.params.id;
    const action = req.body?.action;
    if (!mongoose.Types.ObjectId.isValid(requesterId) || String(req.user._id) === requesterId) {
      return res.status(400).json({ success: false, message: 'Invalid connection request.' });
    }
    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Choose accept or reject.' });
    }
    const requester = await User.findOne({ _id: requesterId, emailVerified: { $ne: false } });
    if (!requester) return res.status(404).json({ success: false, message: 'Requester not found.' });
    const recipient = await User.findById(req.user._id);
    if (!recipient || !(recipient.connectionRequests || []).some(id => String(id) === requesterId)) {
      return res.status(404).json({ success: false, message: 'This request is no longer pending.' });
    }

    recipient.connectionRequests = (recipient.connectionRequests || []).filter(id => String(id) !== requesterId);
    if (action === 'accept') {
      if (!(recipient.connectedUsers || []).some(id => String(id) === requesterId)) recipient.connectedUsers.push(requester._id);
      if (!(requester.connectedUsers || []).some(id => String(id) === String(recipient._id))) requester.connectedUsers.push(recipient._id);
      // Keep legacy profile connection counts in sync.
      if (!(recipient.connectedMentors || []).some(id => String(id) === requesterId)) recipient.connectedMentors.push(requesterId);
      if (!(requester.connectedMentors || []).some(id => String(id) === String(recipient._id))) requester.connectedMentors.push(String(recipient._id));
    }
    await Promise.all([recipient.save(), requester.save()]);
    return res.json({ success: true, action, isConnected: action === 'accept', message: action === 'accept' ? 'Connection accepted. Live chat is now available.' : 'Connection request rejected.' });
  } catch (error) {
    console.error('Respond to connection request error:', error.message);
    return res.status(500).json({ success: false, message: 'Could not update this connection request.' });
  }
});

export default router;
