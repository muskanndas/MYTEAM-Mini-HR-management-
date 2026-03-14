import Leave from '../models/Leave.js';

// Apply for Leave controller
export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    // Validate required fields
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate leave dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        message: "Start date must be before end date"
      });
    }

    // Calculate total days
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Create leave request
    const leave = new Leave({
      userId: req.userId,
      leaveType,
      startDate,
      endDate,
      totalDays,
      status: 'Pending',
      reason
    });

    await leave.save();

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get My Leaves controller
export const getMyLeaves = async (req, res) => {
  try {
    // Get all leaves of logged-in user
    const leaves = await Leave.find({ userId: req.userId })
      .sort({ appliedDate: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Leave controller
export const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { leaveType, startDate, endDate, reason } = req.body;

    // Find leave request
    const leave = await Leave.findOne({ _id: id, userId: req.userId });
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    // Check if leave is pending
    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Can only update pending leave requests' });
    }

    // Calculate total days if dates changed
    let totalDays = leave.totalDays;
    if (startDate || endDate) {
      const start = new Date(startDate || leave.startDate);
      const end = new Date(endDate || leave.endDate);
      totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
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
    );

    res.json(updatedLeave);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Leave controller
export const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;

    // Find leave request
    const leave = await Leave.findOne({ _id: id, userId: req.userId });
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    // Check if leave is pending
    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Can only delete pending leave requests' });
    }

    // Delete leave
    await Leave.findByIdAndDelete(id);

    res.json({ message: 'Leave deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
