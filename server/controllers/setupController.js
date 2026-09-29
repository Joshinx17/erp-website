const Institution = require('../models/Institution');
const Campus = require('../models/Campus');
const AcademicYear = require('../models/AcademicYear');
const User = require('../models/User');

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

exports.getSetupStatus = async (_req, res) => {
  const institution = await Institution.findOne({ status: 'ACTIVE' });
  res.json({ isConfigured: Boolean(institution), institution });
};

exports.completeSetup = async (req, res) => {
  try {
    const { institutionName, type, campusName, academicYearName, startsOn, endsOn } = req.body;
    if (![institutionName, type, campusName, academicYearName, startsOn, endsOn].every(Boolean)) return res.status(400).json({ message: 'Complete the institution, campus, and academic year details.' });
    if (!['SCHOOL', 'COLLEGE', 'UNIVERSITY', 'COACHING'].includes(type)) return res.status(400).json({ message: 'Choose a valid institution type.' });
    if (new Date(startsOn) >= new Date(endsOn)) return res.status(400).json({ message: 'Academic year end date must be after its start date.' });
    if (await Institution.exists({ status: 'ACTIVE' })) return res.status(409).json({ message: 'CampusOS has already been configured.' });
    const institution = await Institution.create({ name: institutionName, slug: `${slugify(institutionName) || 'institution'}-${Date.now().toString(36)}`, type });
    const campus = await Campus.create({ institution: institution._id, name: campusName, code: campusName.slice(0, 8).toUpperCase().replace(/\s/g, '') || 'MAIN' });
    const academicYear = await AcademicYear.create({ institution: institution._id, campus: campus._id, name: academicYearName, startsOn, endsOn, isCurrent: true });
    await User.findByIdAndUpdate(req.user._id, { institution: institution._id, campus: campus._id, role: req.user.role === 'admin' ? 'INSTITUTION_ADMIN' : req.user.role });
    res.status(201).json({ institution, campus, academicYear });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
