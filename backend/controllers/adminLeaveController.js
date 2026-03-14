import Leave from '../models/Leave.js';
import User from '../models/User.js';

// Get All Leaves controller
export const getAllLeaves = async (req, res) => {
  try {
    // Fetch all leave requests with user details
    const leaves = await Leave.find({})
      .populate('userId', 'fullName email')
      .sort({ appliedDate: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Leave Status controller
export const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await Leave.findById(leaveId);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    // Prevent double approval
    if (leave.status !== "Pending") {
      return res.status(400).json({
        message: "Leave already processed"
      });
    }

    leave.status = status;
    await leave.save();

    if (status === "Approved") {

      const user = await User.findById(leave.userId);

      if (user) {
        user.leaveBalance -= leave.totalDays;
        await user.save();
      }

    }

    const updatedLeave = await Leave.findById(leaveId)
      .populate("userId", "fullName email");

    res.json(updatedLeave);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
