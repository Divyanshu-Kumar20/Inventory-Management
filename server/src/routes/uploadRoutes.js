const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticateUser } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

router.post('/', authenticateUser, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload an image file' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: fileUrl
    }
  });
}));

module.exports = router;
