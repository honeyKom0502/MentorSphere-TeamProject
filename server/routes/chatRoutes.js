import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import { requireAuth } from '../middleware/auth.js';
import { moderationService } from '../services/moderationService.js';

const router = express.Router();
router.use(requireAuth);

const fail = (res, status, message) => res.status(status).json({ success: false, message });
const pairKey = (a, b) => [String(a), String(b)].sort().join(':');

const serializeMessage = (m, viewerId) => ({
  id: String(m._id),
  authorId: String(m.author),
  authorName: m.authorName,
  authorRole: m.authorRole,
  authorAvatar: m.authorAvatar || 'avatar-1',
  content: m.content,
  createdAt: new Date(m.createdAt).toISOString(),
  isMine: String(m.author) === viewerId
});

const serializeConversation = (conversation, viewerId) => ({
  id: String(conversation._id),
  messages: (conversation.messages || []).map(m => serializeMessage(m, viewerId)),
  lastMessageAt: conversation.lastMessageAt
});

const getOtherUser = async (participantId, currentUser) => {
  if (!mongoose.Types.ObjectId.isValid(participantId) || String(currentUser._id) === participantId) return null;
  return User.findOne({
    _id: participantId,
    profileVisibility: { $ne: 'private' },
    emailVerified: { $ne: false }
  }).select('fullName role avatar publicId profileVisibility connectedUsers');
};

const areConnected = (currentUser, otherUser) =>
  (currentUser.connectedUsers || []).some(id => String(id) === String(otherUser._id)) &&
  (otherUser.connectedUsers || []).some(id => String(id) === String(currentUser._id));

const getOrCreateConversation = async (currentUser, otherUser) => {
  const key = pairKey(currentUser._id, otherUser._id);
  let conversation = await Conversation.findOne({ participantKey: key });
  if (!conversation) {
    try {
      conversation = await Conversation.create({
        participantKey: key,
        participants: [currentUser._id, otherUser._id],
        messages: [],
        lastMessageAt: new Date()
      });
    } catch (error) {
      if (error?.code !== 11000) throw error;
      conversation = await Conversation.findOne({ participantKey: key });
    }
  }
  return conversation;
};

// GET /api/chats/with/:participantId — open/load a private chat with a real mentor
router.get('/with/:participantId', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) return fail(res, 503, 'Database is not connected.');
    const other = await getOtherUser(req.params.participantId, req.user);
    if (!other) return fail(res, 404, 'Mentor not found or profile is private.');
    if (!areConnected(req.user, other)) return fail(res, 403, 'Accept the connection request before starting a private chat.');
    const conversation = await getOrCreateConversation(req.user, other);
    return res.json({
      success: true,
      conversation: serializeConversation(conversation.toObject(), String(req.user._id)),
      otherUser: { id: String(other._id), fullName: other.fullName, role: other.role, avatar: other.avatar || 'avatar-1' }
    });
  } catch (error) {
    console.error('Open chat error:', error.message);
    return fail(res, 500, 'Could not open this chat.');
  }
});

// POST /api/chats/with/:participantId/messages — send as the authenticated account only
router.post('/with/:participantId/messages', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) return fail(res, 503, 'Database is not connected.');
    const content = typeof req.body?.content === 'string' ? req.body.content.trim() : '';
    if (!content) return fail(res, 400, 'Type a message first.');
    if (content.length > 2000) return fail(res, 400, 'Messages must be 2000 characters or fewer.');
    const other = await getOtherUser(req.params.participantId, req.user);
    if (!other) return fail(res, 404, 'Mentor not found or profile is private.');
    const check = await moderationService.evaluateMessage(content);
    if (!check.isClean) return res.status(422).json({ success: false, message: check.friendlyMessage || 'Please rephrase your message.' });
    if (!areConnected(req.user, other)) return fail(res, 403, 'Accept the connection request before sending messages.');
    const conversation = await getOrCreateConversation(req.user, other);
    conversation.messages.push({
      author: req.user._id,
      authorName: req.user.fullName || req.user.publicId || 'Member',
      authorRole: req.user.role || 'Junior',
      authorAvatar: req.user.avatar || 'avatar-1',
      content
    });
    conversation.lastMessageAt = new Date();
    await conversation.save();
    return res.status(201).json({ success: true, conversation: serializeConversation(conversation.toObject(), String(req.user._id)) });
  } catch (error) {
    console.error('Send chat message error:', error.message);
    return fail(res, 500, 'Could not send your message.');
  }
});

// DELETE /api/chats/:conversationId/messages/:messageId — delete only your own message
router.delete('/:conversationId/messages/:messageId', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.conversationId) || !mongoose.Types.ObjectId.isValid(req.params.messageId)) {
      return fail(res, 404, 'Message not found.');
    }
    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: req.params.conversationId,
        participants: req.user._id,
        messages: { $elemMatch: { _id: req.params.messageId, author: req.user._id } }
      },
      { $pull: { messages: { _id: req.params.messageId, author: req.user._id } } },
      { new: true }
    ).lean();
    if (!conversation) return fail(res, 404, 'Message not found or you do not own it.');
    return res.json({ success: true, conversation: serializeConversation(conversation, String(req.user._id)) });
  } catch (error) {
    console.error('Delete chat message error:', error.message);
    return fail(res, 500, 'Could not delete this message.');
  }
});

export default router;
