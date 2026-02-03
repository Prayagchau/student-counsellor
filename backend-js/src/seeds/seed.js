const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { User, Counsellor, Booking } = require('../models');
const connectDatabase = require('../config/database');

/**
 * Seed Script
 * Creates initial admin and sample data
 */
const seedDatabase = async () => {
  try {
    await connectDatabase();
    console.log('🌱 Starting database seed...\n');

    // Clear existing data (optional - comment out for production)
    await Promise.all([
      User.deleteMany({}),
      Counsellor.deleteMany({}),
      Booking.deleteMany({}),
    ]);
    console.log('✅ Cleared existing data');

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@eduguide.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
    });
    console.log('✅ Admin created:', admin.email);

    // Create Users
    const users = await User.insertMany([
      {
        name: 'John Student',
        email: 'john@student.com',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        isActive: true,
      },
      {
        name: 'Jane Learner',
        email: 'jane@student.com',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        isActive: true,
      },
      {
        name: 'Mike Scholar',
        email: 'mike@student.com',
        password: await bcrypt.hash('password123', 12),
        role: 'user',
        isActive: true,
      },
    ]);
    console.log('✅ Users created:', users.length);

    // Create Counsellor Users
    const counsellorUsers = await User.insertMany([
      {
        name: 'Dr. Sarah Wilson',
        email: 'sarah@counsellor.com',
        password: await bcrypt.hash('password123', 12),
        role: 'counsellor',
        isActive: true,
      },
      {
        name: 'Prof. David Chen',
        email: 'david@counsellor.com',
        password: await bcrypt.hash('password123', 12),
        role: 'counsellor',
        isActive: true,
      },
      {
        name: 'Dr. Emily Brown',
        email: 'emily@counsellor.com',
        password: await bcrypt.hash('password123', 12),
        role: 'counsellor',
        isActive: true,
      },
    ]);
    console.log('✅ Counsellor users created:', counsellorUsers.length);

    // Create Counsellor Profiles
    const counsellors = await Counsellor.insertMany([
      {
        userId: counsellorUsers[0]._id,
        qualification: 'Ph.D. in Educational Psychology',
        specialization: ['Career Counselling', 'Study Abroad', 'Higher Education'],
        experience: 12,
        bio: 'Dr. Sarah Wilson has over 12 years of experience guiding students toward their academic and career goals. She specializes in helping students navigate complex decisions about higher education and career paths.',
        approved: true,
        rating: 4.8,
        totalSessions: 156,
        hourlyRate: 75,
        availabilitySlots: [
          { day: 'monday', startTime: '09:00', endTime: '17:00' },
          { day: 'wednesday', startTime: '09:00', endTime: '17:00' },
          { day: 'friday', startTime: '09:00', endTime: '13:00' },
        ],
      },
      {
        userId: counsellorUsers[1]._id,
        qualification: 'M.Ed. in Counseling, Certified Career Counselor',
        specialization: ['Technical Education', 'Engineering Careers', 'Skill Development'],
        experience: 8,
        bio: 'Prof. David Chen brings extensive experience in technical education and career development. He has helped hundreds of students transition into successful engineering and technology careers.',
        approved: true,
        rating: 4.6,
        totalSessions: 98,
        hourlyRate: 60,
        availabilitySlots: [
          { day: 'tuesday', startTime: '10:00', endTime: '18:00' },
          { day: 'thursday', startTime: '10:00', endTime: '18:00' },
        ],
      },
      {
        userId: counsellorUsers[2]._id,
        qualification: 'M.A. in Psychology, Youth Counselor Certification',
        specialization: ['Student Wellness', 'Academic Stress', 'Time Management'],
        experience: 5,
        bio: 'Dr. Emily Brown focuses on student mental health and academic performance. She helps students develop effective study habits and manage academic pressure.',
        approved: false, // Pending approval
        rating: 0,
        totalSessions: 0,
        hourlyRate: 50,
        availabilitySlots: [
          { day: 'monday', startTime: '14:00', endTime: '20:00' },
          { day: 'wednesday', startTime: '14:00', endTime: '20:00' },
        ],
      },
    ]);
    console.log('✅ Counsellor profiles created:', counsellors.length);

    // Create Sample Bookings
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const bookings = await Booking.insertMany([
      {
        userId: users[0]._id,
        counsellorId: counsellors[0]._id,
        bookingDate: tomorrow,
        timeSlot: '10:00',
        status: 'approved',
        paymentStatus: 'paid',
        notes: 'Need guidance for MBA applications',
      },
      {
        userId: users[1]._id,
        counsellorId: counsellors[0]._id,
        bookingDate: tomorrow,
        timeSlot: '14:00',
        status: 'pending',
        paymentStatus: 'pending',
        notes: 'Career counselling session',
      },
      {
        userId: users[0]._id,
        counsellorId: counsellors[1]._id,
        bookingDate: nextWeek,
        timeSlot: '11:00',
        status: 'pending',
        paymentStatus: 'pending',
        notes: 'Technical career guidance',
      },
      {
        userId: users[2]._id,
        counsellorId: counsellors[0]._id,
        bookingDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last week
        timeSlot: '15:00',
        status: 'completed',
        paymentStatus: 'paid',
        notes: 'Study abroad consultation',
      },
    ]);
    console.log('✅ Bookings created:', bookings.length);

    console.log('\n========================================');
    console.log('🎉 Database seeded successfully!');
    console.log('========================================\n');
    console.log('📧 Test Accounts:');
    console.log('   Admin:      admin@eduguide.com / admin123');
    console.log('   User:       john@student.com / password123');
    console.log('   Counsellor: sarah@counsellor.com / password123');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();
