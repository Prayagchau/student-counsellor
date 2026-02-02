import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ============================================
// ENUMS
// ============================================

export enum UserRole {
  STUDENT = 'student',
  COUNSELLOR = 'counsellor',
  ADMIN = 'admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  PENDING = 'pending'
}

export enum BookingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum CounsellorSpecialization {
  CAREER = 'career',
  ADMISSION = 'admission',
  STUDY_ABROAD = 'study_abroad',
  PLACEMENT = 'placement',
  ACADEMIC = 'academic'
}

// ============================================
// USER INTERFACES
// ============================================

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ICounsellor extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  specializations: CounsellorSpecialization[];
  experience: number;
  bio: string;
  qualifications: string[];
  availability: IAvailability[];
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  hourlyRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAvailability {
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  slots: ITimeSlot[];
}

export interface ITimeSlot {
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
  isBooked: boolean;
}

// ============================================
// BOOKING INTERFACES
// ============================================

export interface IBooking extends Document {
  _id: Types.ObjectId;
  studentId: Types.ObjectId;
  counsellorId: Types.ObjectId;
  serviceType: CounsellorSpecialization;
  date: Date;
  timeSlot: string;
  status: BookingStatus;
  notes?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICounsellingSession extends Document {
  _id: Types.ObjectId;
  bookingId: Types.ObjectId;
  studentId: Types.ObjectId;
  counsellorId: Types.ObjectId;
  sessionNotes?: string;
  recommendations?: string[];
  followUpDate?: Date;
  rating?: number;
  feedback?: string;
  duration: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// REQUEST INTERFACES
// ============================================

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

// ============================================
// API RESPONSE INTERFACES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// JWT PAYLOAD
// ============================================

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
