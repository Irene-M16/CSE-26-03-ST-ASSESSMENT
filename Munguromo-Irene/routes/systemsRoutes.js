const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Upload = require('../models/Upload'); // path to your Upload.js schema


// defines where uploaded files are saved and what they are named
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // videos go to uploads/videos, thumbnails go to uploads/thumbnails
    const folder = file.fieldname === 'video'
      ? 'uploads/videos'
      : 'uploads/thumbnails';
    fs.mkdirSync(folder, { recursive: true }); // create folder if it doesn't exist yet
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    // unique filename: timestamp + random number + original extension
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

// only accept video files in the video field, image files in the thumbnail field
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'video') {
    cb(null, file.mimetype.startsWith('video/'));
  } else if (file.fieldname === 'thumbnail') {
    cb(null, file.mimetype.startsWith('image/'));
  } else {
    cb(null, false);
  }
};

// multer instance with 500MB max file size
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 }
});

// Landing page
router.get('/videx', (req, res) => {
  res.render('videx/index');
});

// Dashboard: fetch all videos from MongoDB, newest first
router.get('/videx/dashboard', async (req, res) => {
  try {
    const videos = await Upload.find().sort({ createdAt: -1 });
    res.render('videx/dashboard', { videos });
  } catch (err) {
    console.error(err);
    res.render('videx/dashboard', { videos: [] });
  }
});

// Upload form: display empty form
router.get('/videx/upload', (req, res) => {
  res.render('videx/upload', { successMsg: null, errorMsg: null, formData: null });
});

// Upload form: handle submission
router.post('/videx/upload', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  const { title, description, quality, publishDate } = req.body;

  // server-side validation (runs even if JS is disabled in the browser)
  const errors = [];
  if (!title || !title.trim()) errors.push('Title is required');
  if (!quality) errors.push('Video quality is required');
  if (!publishDate) errors.push('Publish date is required');
  if (!req.files || !req.files['video']) errors.push('Video file is required');

  if (errors.length > 0) {
    // delete any files already saved before returning the error
    if (req.files) {
      Object.values(req.files).flat().forEach(f => fs.unlink(f.path, () => {}));
    }
    return res.render('videx/upload', {
      successMsg: null,
      errorMsg: errors[0],
      formData: { title, description, quality, publishDate }
    });
  }

  try {
    const videoFile = req.files['video'][0];
    const thumbFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;
    // save the new video record to MongoDB
  const newUpload = new Upload({
    title: title.trim(),
    description: description ? description.trim() : '',
    quality,
    publishDate: new Date(publishDate),
  // replace backslashes with forward slashes for browser URLs
    videoPath: videoFile.path.replace(/\\/g, '/'),
    thumbnailPath: thumbFile ? thumbFile.path.replace(/\\/g, '/') : null
});
    await newUpload.save();
     // re-render form with success banner and cleared fields
    res.render('videx/upload', {
      successMsg: 'Video added successfully',
      errorMsg:   null,
      formData:   null
    });
  } catch (err) {
    console.error(err);
    res.render('videx/upload', {
      successMsg: null,
      errorMsg: 'Something went wrong. Please try again.',
      formData: { title, description, quality, publishDate }
    });
  }
});

module.exports = router;