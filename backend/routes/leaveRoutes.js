import express from 'express';
import { applyLeave, getMyLeaves, updateLeave, deleteLeave } from '../controllers/leaveController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply for leave
router.post('/apply', authMiddleware, applyLeave);

// Get my leaves
router.get('/my-leaves', authMiddleware, getMyLeaves);

// Update leave
router.put('/:id', authMiddleware, updateLeave);

// Delete leave
router.delete('/:id', authMiddleware, deleteLeave);

export default router;
