const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  type: { type: String, enum: ['SCHOOL', 'COLLEGE', 'UNIVERSITY', 'COACHING'], required: true },
  status: { type: String, enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE' },
  settings: { terminology: { type: Map, of: String, default: {} } },
}, { timestamps: true });

module.exports = mongoose.model('Institution', institutionSchema);
