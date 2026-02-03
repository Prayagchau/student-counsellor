const express = require('express');
const authRoutes = require('./auth');
const bookingRoutes = require('./bookings');
const counsellorRoutes = require('./counsellors');
const adminRoutes = require('./admin');
const userRoutes = require('./users');

const router = express.Router();

/**
 * API Routes
 */
router.use('/auth', authRoutes);
router.use('/bookings', bookingRoutes);
router.use('/counsellors', counsellorRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);

/**
 * Health check
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
