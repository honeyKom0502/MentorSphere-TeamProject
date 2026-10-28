import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import discussionRoutes from './routes/discussionRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { moderationService } from './services/moderationService.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Middlewares
// CORS_ORIGIN (optional, comma-separated) restricts which frontends may call the API.
// Unset = allow any origin (fine for a local/demo setup; auth uses Bearer tokens, not cookies).
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors(allowedOrigins.length ? { origin: allowedOrigins } : undefined));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];

  res.json({
    status: 'healthy',
    product: 'MentorSphere',
    version: '1.0.0',
    database: dbStates[mongoose.connection.readyState] || 'unknown',
    timestamp: new Date().toISOString()
  });
});

// Authentication Routes (SignUp & Login)
app.use('/api/auth', authRoutes);

// Discussions (questions & replies) - persisted in MongoDB
app.use('/api/discussions', discussionRoutes);

// Mentorship booking, shared roadmap workspace and session room metadata.
app.use('/api/sessions', sessionRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/chats', chatRoutes);

// Moderation API Route
app.post('/api/moderation/check', async (req, res) => {
  try {
    const { text } = req.body;
    const result = await moderationService.evaluateMessage(text);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Moderation evaluation failed', details: err.message });
  }
});

// Malformed JSON bodies -> 400 instead of an HTML stack trace
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Invalid JSON in request body.' });
  }
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Request is too large.' });
  }
  console.error('Unhandled server error:', err?.message);
  return res.status(500).json({ success: false, message: 'Something went wrong on the server.' });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 MentorSphere Backend API server running on port ${PORT}`);
  });
}

export default app;
