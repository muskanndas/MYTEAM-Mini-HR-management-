import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';
import adminDashboardRoutes from './routes/adminDashboardRoutes.js';

dotenv.config();
const app = express();

// Connect to database first
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api', adminRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api', adminUserRoutes);
app.use('/api', adminDashboardRoutes);

// Global error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message || "Server error"
  });
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'MyTeam Management System API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

export default app;
