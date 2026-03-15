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
import path from 'path';
dotenv.config();
const app = express();

// Connect to database first
connectDB();
const __dirname = path.resolve();
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

// Basic API health route
app.get('/api/health', (req, res) => {
  res.json({ message: 'MyTeam Management System API is running' });
});

// Serve frontend
app.use(express.static(path.join(__dirname, '/frontend/dist')));

// SPA fallback: serve index.html for any GET that didn’t match API or static files
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
  res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

export default app;
