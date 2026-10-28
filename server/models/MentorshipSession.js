import mongoose from 'mongoose';

const boardNodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, default: '', maxlength: 500 },
  color: { type: String, enum: ['blue', 'orange', 'green', 'purple'], default: 'blue' },
  order: { type: Number, default: 0 }
}, { _id: false });

const mentorshipSessionSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  junior: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  goal: { type: String, default: '', trim: true, maxlength: 1500 },
  scheduledAt: { type: Date, required: true },
  durationMinutes: { type: Number, enum: [15, 30, 45, 60], default: 30 },
  status: { type: String, enum: ['pending', 'accepted', 'declined', 'cancelled', 'completed'], default: 'pending', index: true },
  notes: { type: String, default: '', maxlength: 5000 },
  actionItems: { type: [String], default: [] },
  boardNodes: { type: [boardNodeSchema], default: [] },
  roomKey: { type: String, required: true, unique: true }
}, { timestamps: true });

mentorshipSessionSchema.index({ mentor: 1, scheduledAt: 1 });
mentorshipSessionSchema.index({ junior: 1, scheduledAt: 1 });
export default mongoose.models.MentorshipSession || mongoose.model('MentorshipSession', mentorshipSessionSchema);
