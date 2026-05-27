const GalleryItem = require('../models/GalleryItem');

exports.getGalleryItems = async (req, res) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createGalleryItem = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image file is required' });
    const item = await GalleryItem.create({
      title: req.body.title,
      imageUrl: '/uploads/' + req.file.filename,
      description: req.body.description || '',
      uploadedBy: req.user._id,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Gallery item not found' });
    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
