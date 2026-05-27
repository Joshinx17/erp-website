const Assignment = require('../models/Assignment');

exports.getAssignments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.class) filter.class = req.query.class;
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.teacher) filter.teacher = req.query.teacher;
    const assignments = await Assignment.find(filter)
      .populate('subject', 'name code')
      .populate('class', 'name section')
      .populate('teacher', 'name')
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClassAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ class: req.params.classId })
      .populate('subject', 'name code')
      .populate('teacher', 'name')
      .sort({ dueDate: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('subject', 'name code')
      .populate('class', 'name section')
      .populate('teacher', 'name');
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const data = { ...req.body, teacher: req.user._id };
    if (req.file) data.fileUrl = '/uploads/' + req.file.filename;
    const assignment = await Assignment.create(data);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.fileUrl = '/uploads/' + req.file.filename;
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
