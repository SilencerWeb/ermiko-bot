const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
  title: String,
  type: String,
  link: String,
  created: { type: Date, default: Date.now() },
  channelName: String,
  status: { type: String, default: 'waitingForModeration' }, // published | failed | approved | dismissed | waitingForModeration
  errorMessage: String,
  moderationGroupMessageId: String,
  originalPostLink: String,
  isCaptionVisible: { type: Boolean, default: true },
});

const Post = mongoose.model('Post', postSchema);


module.exports = { Post };
