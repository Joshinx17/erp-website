const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema({
  institution: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true, index: true },
  campus: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', required: true, index: true },
  name: { type: String, required: true },
  startsOn: { type: Date, required: true },
  endsOn: { type: Date, required: true },
  isCurrent: { type: Boolean, default: false },
}, { timestamps: true });
academicYearSchema.index({ institution: 1, campus: 1, name: 1 }, { unique: true });
module.exports = mongoose.model('AcademicYear', academicYearSchema);
