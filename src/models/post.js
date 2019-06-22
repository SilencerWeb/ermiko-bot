const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
  title: String,
  isCaptionVisible: { type: Boolean, default: true },
  type: String,
  link: String,
  status: { type: String, default: 'waitingForModeration' }, // published | failed | approved | dismissed | waitingForModeration
  channel: String,
  moderationGroupMessageId: String,
  created: { type: Date, default: Date.now() },
  originalPostLink: String,
  error: String,
});

const Post = mongoose.model('Post', postSchema);


module.exports = { Post };
