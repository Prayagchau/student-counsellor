import mongoose, { Schema, Model } from 'mongoose';
import { ICounsellingSession } from '../types';

/**
 * Counselling Session Schema
 * Records completed counselling sessions with notes and feedback
 */
const counsellingSessionSchema = new Schema<ICounsellingSession>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking ID is required'],
      unique: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    counsellorId: {
      type: Schema.Types.ObjectId,
      ref: 'Counsellor',
      required: [true, 'Counsellor ID is required'],
    },
    sessionNotes: {
      type: String,
      maxlength: [2000, 'Session notes cannot exceed 2000 characters'],
    },
    recommendations: {
      type: [String],
      default: [],
    },
    followUpDate: {
      type: Date,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    feedback: {
      type: String,
      maxlength: [1000, 'Feedback cannot exceed 1000 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'Session duration is required'],
      min: [15, 'Session must be at least 15 minutes'],
      max: [180, 'Session cannot exceed 180 minutes'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================
// INDEXES
// ============================================

counsellingSessionSchema.index({ bookingId: 1 });
counsellingSessionSchema.index({ studentId: 1 });
counsellingSessionSchema.index({ counsellorId: 1 });
counsellingSessionSchema.index({ createdAt: -1 });

// ============================================
// VIRTUALS
// ============================================

counsellingSessionSchema.virtual('booking', {
  ref: 'Booking',
  localField: 'bookingId',
  foreignField: '_id',
  justOne: true,
});

counsellingSessionSchema.virtual('student', {
  ref: 'User',
  localField: 'studentId',
  foreignField: '_id',
  justOne: true,
});

counsellingSessionSchema.virtual('counsellor', {
  ref: 'Counsellor',
  localField: 'counsellorId',
  foreignField: '_id',
  justOne: true,
});

// ============================================
// MODEL EXPORT
// ============================================

const CounsellingSession: Model<ICounsellingSession> = mongoose.model<ICounsellingSession>(
  'CounsellingSession',
  counsellingSessionSchema
);

export default CounsellingSession;
