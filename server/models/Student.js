const mongoose = require('mongoose');
const User = require('./User');

const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  admissionNumber: { type: String, required: true, unique: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  section: { type: String, default: 'A' },
  fatherName: { type: String, default: '' },
  motherName: { type: String, default: '' },
});

module.exports = User.discriminator('student', studentSchema);
