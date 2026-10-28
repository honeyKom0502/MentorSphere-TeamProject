import express from 'express';
import mongoose from 'mongoose';
import Discussion from '../models/Discussion.js';
import { requireAuth } from '../middleware/auth.js';
import { moderationService } from '../services/moderationService.js';

const router = express.Router();

const LIMITS = { title: 200, content: 5000, reply: 3000, tags: 8, tagLength: 30 };
const DUPLICATE_WINDOW_MS = 15 * 1000;
const LIST_LIMIT = 200;
const CHANNEL_PATTERN = /^[a-z0-9-]{2,40}$/;

// Every discussion endpoint needs a verified user and a live DB connection.
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      code: 'DB_UNAVAILABLE',
      message: 'The database is temporarily unavailable. Please try again shortly.'
    });
  }
  return next();
});
router.use(requireAuth);

// ---------- serializers: expose a user's chosen public name only for public posts ----------

const serializeReply = (reply, viewerId) => ({
  id: String(reply._id),
  authorPublicId: reply.authorPublicId,
  authorName: reply.isAnonymous ? reply.authorPublicId : (reply.authorName || reply.authorPublicId),
  authorAvatar: reply.isAnonymous ? 'avatar-1' : reply.authorAvatar,
  authorRole: reply.isAnonymous ? null : reply.authorRole,
  isAnonymous: !!reply.isAnonymous,
  content: reply.content,
  upvotes: reply.upvotes || 0,
  isAccepted: !!reply.isAccepted,
  createdAt: new Date(reply.createdAt).toISOString(),
  isMine: String(reply.author) === viewerId
});

const serializeDiscussion = (doc, viewerId) => ({
  id: String(doc._id),
  channelId: doc.channelId,
  title: doc.title,
  content: doc.content,
  tags: doc.tags || [],
  authorPublicId: doc.authorPublicId,
  authorName: doc.isAnonymous ? doc.authorPublicId : (doc.authorName || doc.authorPublicId),
  authorAvatar: doc.isAnonymous ? 'avatar-1' : doc.authorAvatar,
  authorRole: doc.isAnonymous ? null : doc.authorRole,
  isAnonymous: !!doc.isAnonymous,
  upvotes: doc.upvotes || 0,
  createdAt: new Date(doc.createdAt).toISOString(),
  isMine: String(doc.author) === viewerId,
  replies: (doc.replies || []).map((r) => serializeReply(r, viewerId))
});

// ---------- helpers ----------

const publicIdFor = (user) =>
  user.publicId || `Student-${String(user._id).slice(-4)}`;

const fail = (res, status, message, extra = {}) =>
  res.status(status).json({ success: false, message, ...extra });

const rejectIfModerated = async (res, text) => {
  const check = await moderationService.evaluateMessage(text);
  if (check.isClean) return false;

  fail(res, 422, check.friendlyMessage || 'Please rephrase your message.', {
    code: 'MODERATION_REJECTED',
    flaggedReason: check.flaggedReason
  });
  return true;
};

const handleError = (res, error, action) => {
  if (error?.name === 'ValidationError' || error?.name === 'CastError') {
    return fail(res, 400, 'Invalid data was submitted.');
  }
  console.error(`Discussion error (${action}):`, error.message);
  return fail(res, 500, `Unable to ${action}. Please try again.`);
};

const normalizeTags = (rawTags) => {
  if (!Array.isArray(rawTags)) return [];
  const seen = new Set();
  const out = [];
  for (const t of rawTags) {
    if (typeof t !== 'string') continue;
    const clean = t.trim().replace(/^#/, '').slice(0, LIMITS.tagLength);
    if (clean && !seen.has(clean.toLowerCase())) {
      seen.add(clean.toLowerCase());
      out.push(clean);
    }
    if (out.length >= LIMITS.tags) break;
  }
  return out;
};

// ---------- GET /api/discussions ----------

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (typeof req.query.channelId === 'string' && req.query.channelId) {
      if (!CHANNEL_PATTERN.test(req.query.channelId)) {
        return fail(res, 400, 'Invalid channel.');
      }
      filter.channelId = req.query.channelId;
    }

    const viewerId = String(req.user._id);
    const docs = await Discussion.find(filter)
      .sort({ createdAt: -1 })
      .limit(LIST_LIMIT)
      .lean();

    return res.json({
      success: true,
      discussions: docs.map((d) => serializeDiscussion(d, viewerId))
    });
  } catch (error) {
    return handleError(res, error, 'load discussions');
  }
});

// ---------- GET /api/discussions/:id ----------

router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return fail(res, 404, 'Discussion not found.');
    }

    const doc = await Discussion.findById(req.params.id).lean();
    if (!doc) return fail(res, 404, 'Discussion not found.');

    return res.json({
      success: true,
      discussion: serializeDiscussion(doc, String(req.user._id))
    });
  } catch (error) {
    return handleError(res, error, 'load the discussion');
  }
});

// ---------- DELETE /api/discussions/:id (author only) ----------
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return fail(res, 404, 'Discussion not found.');
    const deleted = await Discussion.findOneAndDelete({ _id: req.params.id, author: req.user._id }).lean();
    if (!deleted) return fail(res, 404, 'Discussion not found or you do not own it.');
    return res.json({ success: true, id: String(deleted._id) });
  } catch (error) {
    return handleError(res, error, 'delete your discussion');
  }
});

// ---------- DELETE /api/discussions/:id/replies/:replyId (reply author only) ----------
router.delete('/:id/replies/:replyId', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id) || !mongoose.Types.ObjectId.isValid(req.params.replyId)) {
      return fail(res, 404, 'Reply not found.');
    }
    const updated = await Discussion.findOneAndUpdate(
      { _id: req.params.id, replies: { $elemMatch: { _id: req.params.replyId, author: req.user._id } } },
      { $pull: { replies: { _id: req.params.replyId, author: req.user._id } } },
      { new: true }
    ).lean();
    if (!updated) return fail(res, 404, 'Reply not found or you do not own it.');
    return res.json({ success: true, discussion: serializeDiscussion(updated, String(req.user._id)) });
  } catch (error) {
    return handleError(res, error, 'delete your reply');
  }
});

// ---------- POST /api/discussions ----------

router.post('/', async (req, res) => {
  try {
    const { channelId, title, content, tags, isAnonymous = true } = req.body || {};

    if (typeof title !== 'string' || !title.trim()) {
      return fail(res, 400, 'Please enter a discussion title.');
    }
    if (typeof content !== 'string' || !content.trim()) {
      return fail(res, 400, 'Please explain your question or context.');
    }
    if (title.trim().length > LIMITS.title) {
      return fail(res, 400, `Title must be ${LIMITS.title} characters or fewer.`);
    }
    if (content.trim().length > LIMITS.content) {
      return fail(res, 400, `Question must be ${LIMITS.content} characters or fewer.`);
    }
    if (typeof channelId !== 'string' || !CHANNEL_PATTERN.test(channelId)) {
      return fail(res, 400, 'Please choose a valid channel.');
    }

    if (await rejectIfModerated(res, `${title} ${content}`)) return undefined;

    const user = req.user;
    const viewerId = String(user._id);

    // Guard against double-clicks / retries creating duplicates.
    const duplicate = await Discussion.findOne({
      author: user._id,
      channelId,
      title: title.trim(),
      content: content.trim(),
      createdAt: { $gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) }
    }).lean();

    if (duplicate) {
      return res.status(200).json({
        success: true,
        duplicate: true,
        discussion: serializeDiscussion(duplicate, viewerId)
      });
    }

    const created = await Discussion.create({
      channelId,
      title: title.trim(),
      content: content.trim(),
      tags: normalizeTags(tags),
      author: user._id,
      authorPublicId: publicIdFor(user),
      authorName: user.fullName || user.name || publicIdFor(user),
      isAnonymous: isAnonymous !== false,
      authorAvatar: user.avatar || 'avatar-1',
      authorRole: user.role || 'Junior',
      upvotes: 0,
      replies: []
    });

    return res.status(201).json({
      success: true,
      discussion: serializeDiscussion(created.toObject(), viewerId)
    });
  } catch (error) {
    return handleError(res, error, 'save your question');
  }
});

// ---------- POST /api/discussions/:id/replies ----------

router.post('/:id/replies', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return fail(res, 404, 'Discussion not found.');
    }

    const { content, isAnonymous = true } = req.body || {};

    if (typeof content !== 'string' || !content.trim()) {
      return fail(res, 400, 'Reply cannot be empty.');
    }
    if (content.trim().length > LIMITS.reply) {
      return fail(res, 400, `Reply must be ${LIMITS.reply} characters or fewer.`);
    }

    if (await rejectIfModerated(res, content)) return undefined;

    const user = req.user;
    const viewerId = String(user._id);
    const text = content.trim();

    // Duplicate guard (same user, same text, same discussion, last few seconds).
    const existing = await Discussion.findOne({
      _id: req.params.id,
      replies: {
        $elemMatch: {
          author: user._id,
          content: text,
          createdAt: { $gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) }
        }
      }
    }).lean();

    if (existing) {
      const dupReply = [...existing.replies]
        .reverse()
        .find((r) => String(r.author) === viewerId && r.content === text);
      return res.status(200).json({
        success: true,
        duplicate: true,
        reply: serializeReply(dupReply, viewerId),
        discussion: serializeDiscussion(existing, viewerId)
      });
    }

    const replyDoc = {
      _id: new mongoose.Types.ObjectId(),
      author: user._id,
      authorPublicId: publicIdFor(user),
      authorName: user.fullName || user.name || publicIdFor(user),
      isAnonymous: isAnonymous !== false,
      authorAvatar: user.avatar || 'avatar-1',
      authorRole: user.role || 'Junior',
      content: text,
      upvotes: 0,
      isAccepted: false,
      createdAt: new Date()
    };

    // Atomic push: two people replying at the same moment will not overwrite each other.
    const updated = await Discussion.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { replies: replyDoc } },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return fail(res, 404, 'Discussion not found.');

    return res.status(201).json({
      success: true,
      reply: serializeReply(replyDoc, viewerId),
      discussion: serializeDiscussion(updated, viewerId)
    });
  } catch (error) {
    return handleError(res, error, 'save your reply');
  }
});

export default router;
