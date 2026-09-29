const Student = require('../models/Student');

exports.getStudents = async (req, res) => {
  try {
    const filter = req.user.institution ? { institution: req.user.institution, deletedAt: null } : { deletedAt: null };
    if (req.query.class) filter.class = req.query.class;
    if (req.query.section) filter.section = req.query.section;
    const students = await Student.find(filter).populate('class', 'name section');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id, ...(req.user.institution ? { institution: req.user.institution } : {}) }).populate('class', 'name section');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (req.user.role === 'student' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate({ _id: req.params.id, ...(req.user.institution ? { institution: req.user.institution } : {}) }, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate({ _id: req.params.id, ...(req.user.institution ? { institution: req.user.institution } : {}) }, { deletedAt: new Date(), isActive: false }, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student archived' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
