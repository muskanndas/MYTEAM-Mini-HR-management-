import User from '../models/User.js';
import Leave from '../models/Leave.js';
import Attendance from '../models/Attendance.js';

// Get Dashboard Statistics controller
export const getDashboardStats = async (req, res) => {
  try {
    // Get today's date and set time to 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch statistics from database
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const totalLeaves = await Leave.countDocuments({});
    const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });
    const todayAttendance = await Attendance.countDocuments({ date: today });

    // Return statistics
    res.json({
      totalEmployees,
      totalLeaves,
      pendingLeaves,
      todayAttendance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
