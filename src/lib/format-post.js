const { prettifyTitle } = require('../utils');


const formatPost = (post) => {
  const formattedPost = {};

  formattedPost.title = prettifyTitle(post.data.title);
  formattedPost.originalPostLink = `https://reddit.com${post.data.permalink}`;

  let postData = null;
  let postHint = null;

  if (post.data.post_hint === 'link') {
    if (post.data.domain === 'i.imgur.com' || post.data.domain === 'gfycat.com') {
      postData = post.data;
      postHint = 'rich:video';
    } else if (post.data.crosspost_parent_list) {
      postData = post.data.crosspost_parent_list[0];

      if (postData.post_hint === 'link') {
        postHint = postData.domain === 'i.imgur.com' || postData.domain === 'gfycat.com' ? 'rich:video' : 'image';
      } else {
        postHint = postData.post_hint;
      }
    } else {
      postData = post.data;
      postHint = 'image';
    }
  } else {
    postData = post.data;
    postHint = post.data.post_hint;
  }

  switch (postHint) {
    case 'image':
      formattedPost.type = postData.url.includes('.gif') ? 'video' : 'image';
      formattedPost.link = postData.url;
      break;
    case 'hosted:video':
      formattedPost.type = 'video';
      formattedPost.link = postData.secure_media ? postData.secure_media.reddit_video.fallback_url : postData.media.reddit_video.fallback_url;
      break;
    case 'rich:video':
      formattedPost.type = 'video';
      if (postData.preview.reddit_video_preview && postData.preview.reddit_video_preview.fallback_url) {
        formattedPost.link = postData.preview.reddit_video_preview.fallback_url;
      }
      break;
  }

  // We don't need to push object if it doesn't have a link
  if (!formattedPost.link) return null;


  return formattedPost;
};


module.exports = { formatPost };
