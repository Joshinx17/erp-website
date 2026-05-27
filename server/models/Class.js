const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  section: { type: String, default: 'A' },
  classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  academicYear: { type: String, default: '' },
}, { timestamps: true });

classSchema.index({ name: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Class', classSchema);
