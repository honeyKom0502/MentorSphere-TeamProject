import mongoose from 'mongoose';
import User from '../models/User.js';
import { verifyAuthToken } from '../utils/authToken.js';

// Verifies the Bearer token and loads the user from MongoDB.
// The user identity ALWAYS comes from the verified token, never from the
// request body, so a client cannot post as someone else.
export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        code: 'AUTH_REQUIRED',
        message: 'Please log in to continue.'
      });
    }

    const payload = verifyAuthToken(token);

    if (!payload || !mongoose.Types.ObjectId.isValid(payload.sub)) {
      return res.status(401).json({
        success: false,
        code: 'AUTH_INVALID',
        message: 'Your session has expired. Please log in again.'
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        code: 'DB_UNAVAILABLE',
        message: 'The database is temporarily unavailable. Please try again shortly.'
      });
    }

    const user = await User.findById(payload.sub).select(
      'fullName email role publicId avatar skills interests joinedChannels connectedMentors savedResources connectionRequests connectedUsers emailVerified createdAt'
    );

    if (!user || user.emailVerified === false) {
      return res.status(401).json({
        success: false,
        code: 'AUTH_INVALID',
        message: 'Your session is no longer valid. Please log in again.'
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to verify your session. Please try again.'
    });
  }
};
