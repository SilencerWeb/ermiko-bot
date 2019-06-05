import mongoose from 'mongoose';


const postSchema = new mongoose.Schema({
  title: String,
  link: String,
  type: String,
  status: String, // published | failed | approved | dismissed | waitingForModeration
  channel: String,
});


export const Post = mongoose.model('Post', postSchema);
