const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, ...extra } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    let user;
    if (role === 'student') {
      if (!extra.rollNumber || !extra.admissionNumber || !extra.class) {
        return res.status(400).json({ message: 'Student requires rollNumber, admissionNumber, and class' });
      }
      user = await Student.create({
        name, email, password, role,
        rollNumber: extra.rollNumber,
        admissionNumber: extra.admissionNumber,
        class: extra.class,
        section: extra.section || 'A',
        phone: extra.phone || '',
        dob: extra.dob || null,
        address: extra.address || '',
        fatherName: extra.fatherName || '',
        motherName: extra.motherName || '',
      });
    } else if (role === 'teacher') {
      if (!extra.employeeId) {
        return res.status(400).json({ message: 'Teacher requires employeeId' });
      }
      user = await Teacher.create({
        name, email, password, role,
        employeeId: extra.employeeId,
        department: extra.department || '',
        qualification: extra.qualification || '',
        phone: extra.phone || '',
        dob: extra.dob || null,
        address: extra.address || '',
      });
    } else if (role === 'admin') {
      user = await User.create({ name, email, password, role });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated. Contact admin.' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let profile = user.toJSON();
    if (user.role === 'student') {
      const student = await Student.findById(user._id)
        .populate('class', 'name section');
      if (student) profile = { ...profile, ...student.toJSON() };
    } else if (user.role === 'teacher') {
      const teacher = await Teacher.findById(user._id)
        .populate('subjects', 'name code');
      if (teacher) profile = { ...profile, ...teacher.toJSON() };
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
