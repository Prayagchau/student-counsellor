import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User, Counsellor, Booking } from '../models';
import { 
  UserRole, 
  UserStatus, 
  CounsellorSpecialization, 
  BookingStatus 
} from '../types';

dotenv.config();

/**
 * Sample Seed Data for Development
 * Run with: npm run seed
 */

const seedDatabase = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduguide';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Counsellor.deleteMany({}),
      Booking.deleteMany({}),
    ]);
    console.log('🗑️ Cleared existing data');

    // ========================================
    // CREATE ADMIN USER
    // ========================================
    const adminPassword = await bcrypt.hash('Admin@123', 12);
    const admin = await User.create({
      fullName: 'Admin User',
      email: 'admin@eduguide.com',
      password: adminPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      phone: '+91 9876543210',
    });
    console.log('👑 Admin created:', admin.email);

    // ========================================
    // CREATE SAMPLE STUDENTS
    // ========================================
    const studentPassword = await bcrypt.hash('Student@123', 12);
    const students = await User.insertMany([
      {
        fullName: 'Arun Mehta',
        email: 'arun@example.com',
        password: studentPassword,
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
        phone: '+91 9876543211',
      },
      {
        fullName: 'Sneha Reddy',
        email: 'sneha@example.com',
        password: studentPassword,
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
        phone: '+91 9876543212',
      },
      {
        fullName: 'Vikram Singh',
        email: 'vikram@example.com',
        password: studentPassword,
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
        phone: '+91 9876543213',
      },
    ]);
    console.log('🎓 Created', students.length, 'students');

    // ========================================
    // CREATE SAMPLE COUNSELLORS
    // ========================================
    const counsellorPassword = await bcrypt.hash('Counsellor@123', 12);
    
    const counsellorUser1 = await User.create({
      fullName: 'Dr. Priya Sharma',
      email: 'priya.sharma@eduguide.com',
      password: counsellorPassword,
      role: UserRole.COUNSELLOR,
      status: UserStatus.ACTIVE,
      phone: '+91 9876543220',
    });

    const counsellorUser2 = await User.create({
      fullName: 'Rajesh Kumar',
      email: 'rajesh.kumar@eduguide.com',
      password: counsellorPassword,
      role: UserRole.COUNSELLOR,
      status: UserStatus.ACTIVE,
      phone: '+91 9876543221',
    });

    const counsellorUser3 = await User.create({
      fullName: 'Dr. Ananya Patel',
      email: 'ananya.patel@eduguide.com',
      password: counsellorPassword,
      role: UserRole.COUNSELLOR,
      status: UserStatus.PENDING,
      phone: '+91 9876543222',
    });

    // Create counsellor profiles
    const counsellors = await Counsellor.insertMany([
      {
        userId: counsellorUser1._id,
        specializations: [CounsellorSpecialization.CAREER, CounsellorSpecialization.PLACEMENT],
        experience: 12,
        bio: 'Dr. Priya Sharma is a career counselling expert with over 12 years of experience helping students discover their ideal career paths. She specializes in psychometric assessments and personality-based career matching.',
        qualifications: ['Ph.D. in Psychology', 'Certified Career Counsellor', 'NLP Practitioner'],
        availability: [
          { dayOfWeek: 1, slots: [{ startTime: '09:00', endTime: '10:00', isBooked: false }] },
          { dayOfWeek: 2, slots: [{ startTime: '10:00', endTime: '11:00', isBooked: false }] },
          { dayOfWeek: 3, slots: [{ startTime: '11:00', endTime: '12:00', isBooked: false }] },
        ],
        rating: 4.9,
        totalReviews: 156,
        isVerified: true,
        hourlyRate: 1500,
      },
      {
        userId: counsellorUser2._id,
        specializations: [CounsellorSpecialization.ADMISSION, CounsellorSpecialization.STUDY_ABROAD],
        experience: 8,
        bio: 'Rajesh Kumar is an admissions expert who has guided over 500 students to top universities. He specializes in study abroad programs and helps students navigate complex application processes.',
        qualifications: ['MBA from IIM', 'Study Abroad Certified Counsellor', 'IELTS Trainer'],
        availability: [
          { dayOfWeek: 1, slots: [{ startTime: '14:00', endTime: '15:00', isBooked: false }] },
          { dayOfWeek: 4, slots: [{ startTime: '15:00', endTime: '16:00', isBooked: false }] },
        ],
        rating: 4.7,
        totalReviews: 89,
        isVerified: true,
        hourlyRate: 1200,
      },
      {
        userId: counsellorUser3._id,
        specializations: [CounsellorSpecialization.ACADEMIC, CounsellorSpecialization.CAREER],
        experience: 5,
        bio: 'Dr. Ananya Patel is an academic counsellor focusing on helping students improve their study habits and academic performance. She brings a fresh perspective to career guidance.',
        qualifications: ['Ph.D. in Education', 'Certified Academic Coach'],
        availability: [
          { dayOfWeek: 2, slots: [{ startTime: '16:00', endTime: '17:00', isBooked: false }] },
        ],
        rating: 0,
        totalReviews: 0,
        isVerified: false, // Pending verification
        hourlyRate: 800,
      },
    ]);
    console.log('👨‍⚕️ Created', counsellors.length, 'counsellors');

    // ========================================
    // CREATE SAMPLE BOOKINGS
    // ========================================
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(0, 0, 0, 0);

    const bookings = await Booking.insertMany([
      {
        studentId: students[0]._id,
        counsellorId: counsellors[0]._id,
        serviceType: CounsellorSpecialization.CAREER,
        date: tomorrow,
        timeSlot: '10:00',
        status: BookingStatus.APPROVED,
        notes: 'Looking for career guidance after 12th',
      },
      {
        studentId: students[1]._id,
        counsellorId: counsellors[0]._id,
        serviceType: CounsellorSpecialization.PLACEMENT,
        date: tomorrow,
        timeSlot: '11:00',
        status: BookingStatus.PENDING,
        notes: 'Need help with placement preparation',
      },
      {
        studentId: students[2]._id,
        counsellorId: counsellors[1]._id,
        serviceType: CounsellorSpecialization.STUDY_ABROAD,
        date: nextWeek,
        timeSlot: '14:00',
        status: BookingStatus.PENDING,
        notes: 'Want to explore US university options',
      },
    ]);
    console.log('📅 Created', bookings.length, 'bookings');

    // ========================================
    // SUMMARY
    // ========================================
    console.log('\n========================================');
    console.log('✅ Database seeded successfully!');
    console.log('========================================\n');
    console.log('Test Accounts:');
    console.log('──────────────');
    console.log('Admin:     admin@eduguide.com / Admin@123');
    console.log('Student:   arun@example.com / Student@123');
    console.log('Counsellor: priya.sharma@eduguide.com / Counsellor@123');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
