const { User, Counsellor } = require('../models');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Auth Controller
 */
const AuthController = {
  /**
   * Signup - Register new user
   * POST /api/auth/signup
   */
  signup: async (req, res) => {
    try {
      const { name, email, password, role = 'user' } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return errorResponse(res, 'Email already registered', 400);
      }

      // Create user
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role,
      });

      // If counsellor, create empty profile
      if (role === 'counsellor') {
        await Counsellor.create({
          userId: user._id,
          qualification: 'Pending',
          specialization: ['General'],
          experience: 0,
          approved: false,
        });
      }

      // Generate token
      const token = generateToken(user._id.toString(), user.email, user.role);

      return successResponse(
        res,
        {
          user: user.toPublicJSON(),
          token,
        },
        'Registration successful',
        201
      );
    } catch (error) {
      console.error('Signup error:', error);
      return errorResponse(res, 'Registration failed', 500);
    }
  },

  /**
   * Login - Authenticate user
   * POST /api/auth/login
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user with password
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        return errorResponse(res, 'Invalid email or password', 401);
      }

      // Check if active
      if (!user.isActive) {
        return errorResponse(res, 'Account is deactivated. Contact support.', 403);
      }

      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return errorResponse(res, 'Invalid email or password', 401);
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      // Generate token
      const token = generateToken(user._id.toString(), user.email, user.role);

      return successResponse(res, {
        user: user.toPublicJSON(),
        token,
      }, 'Login successful');
    } catch (error) {
      console.error('Login error:', error);
      return errorResponse(res, 'Login failed', 500);
    }
  },

  /**
   * Get Profile - Get current user's profile
   * GET /api/auth/me
   */
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }

      let counsellorProfile = null;
      if (user.role === 'counsellor') {
        counsellorProfile = await Counsellor.findOne({ userId: user._id });
      }

      return successResponse(res, {
        user: user.toPublicJSON(),
        counsellorProfile,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      return errorResponse(res, 'Failed to fetch profile', 500);
    }
  },

  /**
   * Update Profile
   * PUT /api/auth/profile
   */
  updateProfile: async (req, res) => {
    try {
      const { name } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { name },
        { new: true, runValidators: true }
      );

      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }

      return successResponse(res, { user: user.toPublicJSON() }, 'Profile updated');
    } catch (error) {
      console.error('Update profile error:', error);
      return errorResponse(res, 'Failed to update profile', 500);
    }
  },

  /**
   * Change Password
   * PUT /api/auth/password
   */
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user.id).select('+password');
      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return errorResponse(res, 'Current password is incorrect', 400);
      }

      user.password = newPassword;
      await user.save();

      return successResponse(res, null, 'Password changed successfully');
    } catch (error) {
      console.error('Change password error:', error);
      return errorResponse(res, 'Failed to change password', 500);
    }
  },
};

module.exports = AuthController;
