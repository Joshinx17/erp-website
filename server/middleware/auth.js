const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role '${req.user.role}' is not authorized for this action` });
    }
    next();
  };
};

const rolePermissions = {
  admin: ['*'], SUPER_ADMIN: ['*'], INSTITUTION_ADMIN: ['*'], PRINCIPAL_DIRECTOR: ['student.read', 'student.create', 'student.update', 'attendance.report', 'exam.create', 'exam.marks.enter'],
  ACADEMIC_ADMIN: ['student.read', 'student.create', 'student.update', 'attendance.mark', 'attendance.edit', 'attendance.report', 'exam.create', 'exam.marks.enter'],
  teacher: ['student.read', 'attendance.mark', 'exam.marks.enter'], TEACHER_FACULTY: ['student.read', 'attendance.mark', 'exam.marks.enter'],
  student: ['student.self.read'], STUDENT: ['student.self.read'], parent: ['student.linked.read'], PARENT: ['student.linked.read'],
};
const requirePermission = (...permissions) => (req, res, next) => {
  const granted = new Set([...(rolePermissions[req.user.role] || []), ...(req.user.permissions || [])]);
  if (granted.has('*') || permissions.every((permission) => granted.has(permission))) return next();
  return res.status(403).json({ message: 'You do not have permission for this action.' });
};

module.exports = { protect, authorize, requirePermission };
