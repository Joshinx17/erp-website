const Submission = require('../models/Submission');

exports.submitAssignment = async (req, res) => {
  try {
    const data = { ...req.body, student: req.user._id };
    if (req.file) data.fileUrl = '/uploads/' + req.file.filename;

    const existing = await Submission.findOne({ assignment: data.assignment, student: data.student });
    if (existing) {
      existing.fileUrl = data.fileUrl || existing.fileUrl;
      existing.notes = data.notes || existing.notes;
      await existing.save();
      return res.json(existing);
    }

    const submission = await Submission.create(data);
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.assignment) filter.assignment = req.query.assignment;
    if (req.query.student) filter.student = req.query.student;
    const submissions = await Submission.find(filter)
      .populate('student', 'name rollNumber')
      .populate('assignment', 'title')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate({
        path: 'assignment',
        populate: { path: 'subject', select: 'name' }
      })
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { marks, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { marks, feedback, status: 'graded' },
      { new: true, runValidators: true }
    );
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
