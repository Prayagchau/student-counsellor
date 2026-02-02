import mongoose, { Schema, Model } from 'mongoose';
import { ICounsellor, CounsellorSpecialization } from '../types';

/**
 * Counsellor Schema
 * Extended profile data for users with counsellor role
 * References the User model via userId
 */
const counsellorSchema = new Schema<ICounsellor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specializations: {
      type: [String],
      enum: Object.values(CounsellorSpecialization),
      required: [true, 'At least one specialization is required'],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: 'At least one specialization is required',
      },
    },
    experience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative'],
      max: [50, 'Experience seems unrealistic'],
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      minlength: [50, 'Bio must be at least 50 characters'],
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    qualifications: {
      type: [String],
      required: [true, 'At least one qualification is required'],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: 'At least one qualification is required',
      },
    },
    availability: [
      {
        dayOfWeek: {
          type: Number,
          min: 0,
          max: 6,
          required: true,
        },
        slots: [
          {
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
            isBooked: { type: Boolean, default: false },
          },
        ],
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false, // Admin must verify counsellors
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: [0, 'Hourly rate cannot be negative'],
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

counsellorSchema.index({ userId: 1 });
counsellorSchema.index({ specializations: 1 });
counsellorSchema.index({ isVerified: 1 });
counsellorSchema.index({ rating: -1 });
counsellorSchema.index({ experience: -1 });

// ============================================
// VIRTUALS
// ============================================

/**
 * Virtual to populate user data
 */
counsellorSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// ============================================
// MODEL EXPORT
// ============================================

const Counsellor: Model<ICounsellor> = mongoose.model<ICounsellor>(
  'Counsellor',
  counsellorSchema
);

export default Counsellor;
