const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  // quality options: 360, 480, 720, 1080, 1440, 2160
  quality: {
    type: String,
    required: [true, 'Video quality is required'],
    enum: ['360', '480', '720', '1080', '1440', '2160']
  },
  publishDate: {
    type: Date,
    required: [true, 'Publish date is required']
  },
  // path to the saved video file on the server
  videoPath: {
    type: String,
    required: [true, 'Video path is required']
  },
}, { timestamps: true })

module.exports = mongoose.model('Upload', uploadSchema);