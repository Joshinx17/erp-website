const mongoose = require('mongoose');
const User = require('./User');

const teacherSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  department: { type: String, default: '' },
  qualification: { type: String, default: '' },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
});

module.exports = User.discriminator('teacher', teacherSchema);
