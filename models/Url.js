const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // optional: track hits
  clicks: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Urls', UrlSchema);
