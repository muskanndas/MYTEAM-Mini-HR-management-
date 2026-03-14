import Leave from "../models/Leave.js";
import User from "../models/User.js";

// Apply for Leave controller
export const applyLeave = async (req, res) => {
  try {
    // Validate user authentication
    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated. Please login to apply for leave."
      });
    }

    // Check if user exists in database
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found. Please register or login again."
      });
    }

    const { leaveType, startDate, endDate, reason } = req.body;

    // Validate required fields
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Convert to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate leave date range
    if (start > end) {
      return res.status(400).json({
        message: "Start date must be before end date"
      });
    }

    // Prevent overlapping leave
    const overlappingLeave = await Leave.findOne({
      userId: req.userId,
      $or: [
        { startDate: { $lt: start }, endDate: { $gt: start } },  // New leave starts during existing leave
        { startDate: { $lt: end }, endDate: { $gt: end } },    // New leave ends during existing leave
        { startDate: { $gte: start }, endDate: { $lte: end } }  // New leave is completely within existing leave
      ]
    });

    if (overlappingLeave) {
      return res.status(400).json({
        message: "Leave already exists for selected dates"
      });
    }

    // Calculate total days
    const totalDays =
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Create leave request with validated user ID
    const leave = await Leave.create({
      userId: req.userId,
      leaveType,
      startDate,
      endDate,
      totalDays,
      status: "Pending",
      reason
    });

    res.status(201).json({
      message: "Leave applied successfully",
      leave
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};


// Get My Leaves controller
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.userId })
      .populate("userId", "fullName email")
      .sort({ appliedDate: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};


// Update Leave controller
export const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { leaveType, startDate, endDate, reason } = req.body;

    // Find leave belonging to logged-in user
    const leave = await Leave.findOne({
      _id: id,
      userId: req.userId
    });

    if (!leave) {
      return res.status(404).json({
        message: "Leave not found"
      });
    }

    // Only pending leaves can be updated
    if (leave.status !== "Pending") {
      return res.status(400).json({
        message: "Can only update pending leave requests"
      });
    }

    // Calculate total days if dates changed
    let totalDays = leave.totalDays;
    if (startDate || endDate) {
      const start = new Date(startDate || leave.startDate);
      const end = new Date(endDate || leave.endDate);

      if (start > end) {
        return res.status(400).json({
          message: "Start date must be before end date"
        });
      }

      totalDays =
        Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }

    // Update leave
    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      {
        leaveType: leaveType || leave.leaveType,
        startDate: startDate || leave.startDate,
        endDate: endDate || leave.endDate,
        totalDays,
        reason: reason || leave.reason
      },
      { new: true }
    ).populate("userId", "fullName email");

    res.json(updatedLeave);
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};


// Delete Leave controller
export const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findOne({
      _id: id,
      userId: req.userId
    });

    if (!leave) {
      return res.status(404).json({
        message: "Leave not found"
      });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({
        message: "Can only delete pending leave requests"
      });
    }

    await Leave.findByIdAndDelete(id);

    res.json({
      message: "Leave deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};