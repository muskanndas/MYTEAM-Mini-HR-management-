import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  leaveType: {
    type: String,
    enum: ['Casual', 'Sick', 'Paid'],
    required: [true, 'Leave type is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  totalDays: {
    type: Number,
    required: [true, 'Total days is required'],
    min: [1, 'Total days must be at least 1']
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  reason: {
    type: String,
    trim: true,
    maxlength: [200, 'Reason cannot exceed 200 characters']
  }
}, {
  timestamps: true
});

// Index for efficient queries
leaveSchema.index({ userId: 1, status: 1 });
leaveSchema.index({ userId: 1, appliedDate: -1 });

export default mongoose.model('Leave', leaveSchema);
