import Attendance from '../models/Attendance.js';

// Mark Attendance controller
export const markAttendance = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.userId;

    // Validate status
    if (!["Present", "Absent"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use Present or Absent" });
    }

    // Get today's date and set time to 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if attendance already exists for today
    const existingAttendance = await Attendance.findOne({
      userId,
      date: today
    });

    if (existingAttendance) {
      return res.status(400).json({ message: "Attendance already marked for today" });
    }

    // Create attendance record
    const attendance = new Attendance({
      userId,
      date: today,
      status
    });

    await attendance.save();

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get My Attendance controller
export const getMyAttendance = async (req, res) => {
  try {
    const userId = req.userId;

    // Get attendance records of logged-in user
    const attendanceRecords = await Attendance.find({ userId })
      .sort({ date: -1 });

    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Attendance (Admin) controller
export const getAllAttendance = async (req, res) => {
  try {
    // Fetch attendance of all employees with user details
    const attendanceRecords = await Attendance.find({})
      .populate('userId', 'fullName email')
      .sort({ date: -1 });

    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
