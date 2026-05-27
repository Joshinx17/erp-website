const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Exam = require('../models/Exam');
const Result = require('../models/Result');
const Notification = require('../models/Notification');

exports.getAdminDashboard = async (req, res) => {
  try {
    const [totalStudents, totalTeachers, totalClasses, totalSubjects, recentNotifications] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Class.countDocuments(),
      Subject.countDocuments(),
      Notification.find().sort({ createdAt: -1 }).limit(5).populate('createdBy', 'name'),
    ]);
    res.json({ totalStudents, totalTeachers, totalClasses, totalSubjects, recentNotifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTeacherDashboard = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user._id);
    const [totalAssignments, totalExams, recentNotifications] = await Promise.all([
      Assignment.countDocuments({ teacher: req.user._id }),
      Exam.countDocuments({ subject: { $in: teacher.subjects || [] } }),
      Notification.find({ $or: [{ targetRole: 'teacher' }, { targetRole: 'all' }] })
        .sort({ createdAt: -1 }).limit(5).populate('createdBy', 'name'),
    ]);
    const classes = await Class.find({ classTeacher: req.user._id });
    const classIds = classes.map(c => c._id);
    const totalStudents = await Student.countDocuments({ class: { $in: classIds } });
    res.json({ totalStudents, totalAssignments, totalExams, recentNotifications, classes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    const [totalAttendance, presentCount, upcomingExams, pendingAssignments, recentNotifications] = await Promise.all([
      Attendance.countDocuments({ student: req.user._id }),
      Attendance.countDocuments({ student: req.user._id, status: 'Present' }),
      Exam.find({ class: student.class, date: { $gte: new Date() } })
        .populate('subject', 'name').sort({ date: 1 }).limit(5),
      Assignment.find({ class: student.class, dueDate: { $gte: new Date() } })
        .populate('subject', 'name').sort({ dueDate: 1 }).limit(5),
      Notification.find({ $or: [{ targetRole: 'student' }, { targetRole: 'all' }] })
        .sort({ createdAt: -1 }).limit(5).populate('createdBy', 'name'),
    ]);
    res.json({
      totalAttendance, presentCount, absentCount: totalAttendance - presentCount,
      attendancePercentage: totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0,
      upcomingExams, pendingAssignments, recentNotifications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
