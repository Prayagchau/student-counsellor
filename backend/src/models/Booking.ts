import mongoose, { Schema, Model } from 'mongoose';
import { IBooking, BookingStatus, CounsellorSpecialization } from '../types';

/**
 * Booking Schema
 * Manages appointment bookings between students and counsellors
 */
const bookingSchema = new Schema<IBooking>(
  {
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
    serviceType: {
      type: String,
      enum: Object.values(CounsellorSpecialization),
      required: [true, 'Service type is required'],
    },
    date: {
      type: Date,
      required: [true, 'Booking date is required'],
      validate: {
        validator: function (date: Date) {
          // Date must be in the future (or today)
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        message: 'Booking date must be today or in the future',
      },
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      match: [/^\d{2}:\d{2}$/, 'Time slot must be in HH:MM format'],
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    adminNotes: {
      type: String,
      maxlength: [500, 'Admin notes cannot exceed 500 characters'],
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

bookingSchema.index({ studentId: 1 });
bookingSchema.index({ counsellorId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ date: 1 });
bookingSchema.index({ createdAt: -1 });

// Compound index to prevent double bookings
bookingSchema.index(
  { counsellorId: 1, date: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: 'cancelled' } } }
);

// ============================================
// VIRTUALS
// ============================================

bookingSchema.virtual('student', {
  ref: 'User',
  localField: 'studentId',
  foreignField: '_id',
  justOne: true,
});

bookingSchema.virtual('counsellor', {
  ref: 'Counsellor',
  localField: 'counsellorId',
  foreignField: '_id',
  justOne: true,
});

// ============================================
// MODEL EXPORT
// ============================================

const Booking: Model<IBooking> = mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
