const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, default: '09:00' },
  duration: { type: Number, default: 180 },
  totalMarks: { type: Number, default: 100 },
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
