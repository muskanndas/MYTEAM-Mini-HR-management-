import express from 'express';
import { registerUser, loginUser, getProfile, sendOtp, verifyOtp, resetPassword, logoutUser } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Protected profile route
router.get('/profile', authMiddleware, getProfile);

// OTP routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// Logout route
router.post('/logout', logoutUser);

export default router;
