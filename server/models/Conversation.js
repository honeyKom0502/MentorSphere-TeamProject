import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true, trim: true },
  authorRole: { type: String, enum: ['Junior', 'Senior', 'Alumni'], default: 'Junior' },
  authorAvatar: { type: String, default: 'avatar-1' },
  content: { type: String, required: true, trim: true, maxlength: 2000 },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const conversationSchema = new mongoose.Schema({
  participantKey: { type: String, required: true, unique: true, index: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: { type: [messageSchema], default: [] },
  lastMessageAt: { type: Date, default: Date.now }
}, { timestamps: true });

conversationSchema.index({ participants: 1, lastMessageAt: -1 });
export default mongoose.model('Conversation', conversationSchema);
