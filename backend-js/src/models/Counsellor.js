const mongoose = require('mongoose');

/**
 * Availability Slot Sub-Schema
 */
const availabilitySlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    },
    startTime: {
      type: String,
      required: true,
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
    },
    endTime: {
      type: String,
      required: true,
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
    },
  },
  { _id: false }
);

/**
 * Counsellor Schema
 * Extended profile for counsellor users
 */
const counsellorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
      trim: true,
      maxlength: [200, 'Qualification cannot exceed 200 characters'],
    },
    specialization: {
      type: [String],
      required: [true, 'At least one specialization is required'],
      validate: {
        validator: function (arr) {
          return arr.length > 0 && arr.length <= 10;
        },
        message: 'Must have 1-10 specializations',
      },
    },
    experience: {
      type: Number,
      required: [true, 'Experience is required'],
      min: [0, 'Experience cannot be negative'],
      max: [50, 'Experience seems unrealistic'],
    },
    bio: {
      type: String,
      maxlength: [2000, 'Bio cannot exceed 2000 characters'],
    },
    availabilitySlots: {
      type: [availabilitySlotSchema],
      default: [],
    },
    approved: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalSessions: {
      type: Number,
      default: 0,
    },
    hourlyRate: {
      type: Number,
      default: 0,
      min: 0,
    },
    profileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
counsellorSchema.index({ userId: 1 });
counsellorSchema.index({ approved: 1 });
counsellorSchema.index({ specialization: 1 });
counsellorSchema.index({ rating: -1 });

// Virtual for user details
counsellorSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Instance method to get public profile
counsellorSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    userId: this.userId,
    qualification: this.qualification,
    specialization: this.specialization,
    experience: this.experience,
    bio: this.bio,
    availabilitySlots: this.availabilitySlots,
    approved: this.approved,
    rating: this.rating,
    totalSessions: this.totalSessions,
    hourlyRate: this.hourlyRate,
    profileImage: this.profileImage,
  };
};

const Counsellor = mongoose.model('Counsellor', counsellorSchema);

module.exports = Counsellor;
