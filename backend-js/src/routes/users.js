const express = require('express');
const { authenticate } = require('../middlewares');
const { successResponse } = require('../utils/response');

const router = express.Router();

/**
 * @route   GET /api/users/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authenticate, (req, res) => {
  return successResponse(res, { user: req.user });
});

module.exports = router;
