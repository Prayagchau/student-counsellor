const mongoose = require('mongoose');

/**
 * Booking Schema
 * Handles appointment scheduling with double-booking prevention
 */
const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    counsellorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Counsellor',
      required: [true, 'Counsellor ID is required'],
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
    },
    duration: {
      type: Number,
      default: 60,
      min: [15, 'Session must be at least 15 minutes'],
      max: [180, 'Session cannot exceed 180 minutes'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    cancelReason: {
      type: String,
      maxlength: [500, 'Cancel reason cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index to prevent double booking
bookingSchema.index(
  { counsellorId: 1, bookingDate: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: { $nin: ['cancelled', 'rejected'] } } }
);

// Other indexes
bookingSchema.index({ userId: 1 });
bookingSchema.index({ counsellorId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingDate: 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for user details
bookingSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for counsellor details
bookingSchema.virtual('counsellor', {
  ref: 'Counsellor',
  localField: 'counsellorId',
  foreignField: '_id',
  justOne: true,
});

// Static method to check for existing booking
bookingSchema.statics.isSlotBooked = async function (counsellorId, bookingDate, timeSlot) {
  const existingBooking = await this.findOne({
    counsellorId,
    bookingDate,
    timeSlot,
    status: { $nin: ['cancelled', 'rejected'] },
  });
  return !!existingBooking;
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
