const express = require('express');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');
const { 
  uploadAvatar, 
  uploadProjectImages, 
  uploadMessageAttachments, 
  handleUploadError,
  getFileUrl 
} = require('../middleware/upload');
const User = require('../models/User');
const Project = require('../models/Project');
const router = express.Router();

// @route   POST /api/upload/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/avatar', authenticateToken, uploadAvatar, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findById(req.user._id);
    
    // Delete old avatar if exists
    if (user.avatar) {
      const oldAvatarPath = path.join(__dirname, '../uploads', user.avatar);
      require('fs').unlinkSync(oldAvatarPath);
    }

    // Update user avatar
    const avatarPath = `avatars/${req.file.filename}`;
    user.avatar = avatarPath;
    await user.save();

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar: getFileUrl(req, avatarPath),
        avatarPath: avatarPath
      }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar'
    });
  }
});

// @route   POST /api/upload/project-images
// @desc    Upload project images
// @access  Private
router.post('/project-images', authenticateToken, uploadProjectImages, handleUploadError, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const images = req.files.map(file => ({
      url: getFileUrl(req, `projects/${file.filename}`),
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: { images }
    });
  } catch (error) {
    console.error('Upload project images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images'
    });
  }
});

// @route   POST /api/upload/message-attachments
// @desc    Upload message attachments
// @access  Private
router.post('/message-attachments', authenticateToken, uploadMessageAttachments, handleUploadError, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const attachments = req.files.map(file => ({
      url: getFileUrl(req, `attachments/${file.filename}`),
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      fileType: file.mimetype.split('/')[0]
    }));

    res.json({
      success: true,
      message: 'Attachments uploaded successfully',
      data: { attachments }
    });
  } catch (error) {
    console.error('Upload message attachments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload attachments'
    });
  }
});

// @route   DELETE /api/upload/:type/:filename
// @desc    Delete uploaded file
// @access  Private
router.delete('/:type/:filename', authenticateToken, async (req, res) => {
  try {
    const { type, filename } = req.params;
    
    // Validate file type
    const allowedTypes = ['avatars', 'projects', 'attachments'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type'
      });
    }

    const filePath = path.join(__dirname, '../uploads', type, filename);
    
    // Check if file exists
    if (!require('fs').existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete file
    require('fs').unlinkSync(filePath);

    // If it's an avatar, update user record
    if (type === 'avatars') {
      const user = await User.findById(req.user._id);
      if (user.avatar && user.avatar.includes(filename)) {
        user.avatar = null;
        await user.save();
      }
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file'
    });
  }
});

// @route   GET /api/upload/:type/:filename
// @desc    Serve uploaded files
// @access  Public
router.get('/:type/:filename', (req, res) => {
  try {
    const { type, filename } = req.params;
    
    // Validate file type
    const allowedTypes = ['avatars', 'projects', 'attachments'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type'
      });
    }

    const filePath = path.join(__dirname, '../uploads', type, filename);
    
    // Check if file exists
    if (!require('fs').existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Set appropriate headers
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };

    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', mimeType);
    
    // Send file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Serve file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to serve file'
    });
  }
});

module.exports = router;
