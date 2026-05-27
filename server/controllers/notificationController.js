const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'student') {
      filter.$or = [{ targetRole: 'student' }, { targetRole: 'all' }];
    } else if (req.user.role === 'teacher') {
      filter.$or = [{ targetRole: 'teacher' }, { targetRole: 'all' }];
    }
    const notifications = await Notification.find(filter)
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const notification = await Notification.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
