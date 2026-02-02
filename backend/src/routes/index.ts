import { Router } from 'express';
import authRoutes from './auth';
import bookingRoutes from './bookings';
import counsellorRoutes from './counsellors';
import adminRoutes from './admin';

const router = Router();

/**
 * API Routes
 */
router.use('/auth', authRoutes);
router.use('/bookings', bookingRoutes);
router.use('/counsellors', counsellorRoutes);
router.use('/admin', adminRoutes);

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

export default router;
