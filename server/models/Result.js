const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  marksObtained: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  grade: { type: String, default: '' },
  remark: { type: String, default: '' },
}, { timestamps: true });

resultSchema.index({ student: 1, exam: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);
