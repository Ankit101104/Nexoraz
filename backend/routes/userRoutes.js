const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

// GET /api/users/profile - Get user profile
router.get('/profile', auth, getUserProfile);

// PUT /api/users/profile - Update user profile
router.put('/profile', auth, updateUserProfile);

module.exports = router; 