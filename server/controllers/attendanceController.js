const Attendance = require('../models/Attendance');

exports.markAttendance = async (req, res) => {
  try {
    const { records } = req.body;
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'Records array is required' });
    }
    const results = [];
    for (const record of records) {
      const existing = await Attendance.findOne({
        student: record.student,
        date: new Date(record.date).setHours(0, 0, 0, 0),
      });
      if (existing) {
        existing.status = record.status;
        existing.remark = record.remark || '';
        await existing.save();
        results.push(existing);
      } else {
        const att = await Attendance.create({
          student: record.student,
          class: record.class,
          subject: record.subject,
          date: record.date,
          status: record.status,
          markedBy: req.user._id,
          remark: record.remark || '',
        });
        results.push(att);
      }
    }
    res.status(201).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const filter = {};
    if (req.query.student) filter.student = req.query.student;
    if (req.query.class) filter.class = req.query.class;
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.from || req.query.to) {
      filter.date = {};
      if (req.query.from) filter.date.$gte = new Date(req.query.from);
      if (req.query.to) filter.date.$lte = new Date(req.query.to);
    }
    const attendance = await Attendance.find(filter)
      .populate('student', 'name rollNumber')
      .populate('class', 'name section')
      .populate('subject', 'name')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const att = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!att) return res.status(404).json({ message: 'Attendance record not found' });
    res.json(att);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const attendance = await Attendance.find({ student: studentId })
      .populate('subject', 'name')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
