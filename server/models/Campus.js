const mongoose = require('mongoose');

const campusSchema = new mongoose.Schema({
  institution: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true, index: true },
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, trim: true },
  address: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });
campusSchema.index({ institution: 1, code: 1 }, { unique: true });
module.exports = mongoose.model('Campus', campusSchema);
