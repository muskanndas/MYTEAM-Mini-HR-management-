import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  date: {
 type: Date,
  default: Date.now
},
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: [true, 'Status is required']
  }
}, {
  timestamps: true
});

// Compound unique index to ensure only one attendance record per user per day
attendanceSchema.index(
  { userId: 1, date: 1 }, 
  { unique: true }
);

// Index for efficient queries
attendanceSchema.index({ userId: 1, date: -1 });
attendanceSchema.index({ date: 1 });

export default mongoose.model('Attendance', attendanceSchema);
