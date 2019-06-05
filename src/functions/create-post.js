import { formatPost } from './functions';
import { Post } from '../models/models';
import { CHANNELS_INFO } from '../constants/constants';


export const createPost = (post) => {
  const formattedPost = formatPost(post);

  formattedPost.status = 'waitingForModeration';
  formattedPost.channel = Object.keys(CHANNELS_INFO).find((channelName) => CHANNELS_INFO[channelName].subreddit === post.data.subreddit);

  const newPost = new Post(formattedPost);

  return newPost.save();
};
