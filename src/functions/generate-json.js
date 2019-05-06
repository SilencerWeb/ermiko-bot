import fs from 'fs';
import axios from 'axios';
import { getDateAsString, sendErrorMessage, prettifyTitle } from '../utils/utils';


const fetchPosts = () => {
  return axios.get('https://www.reddit.com/r/aww/top/.json?t=day&limit=100');
};

const formatPosts = (posts) => {
  const originalPosts = posts.data.children;
  const formattedPosts = [];

  originalPosts.forEach((post) => {
    const formattedPost = {};
    formattedPost.title = prettifyTitle(post.data.title);
    formattedPost.status = 'not sent';

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
    if (!formattedPost.link) {
      const errorMessage = `Invalid post with id ${postData.id} and permalink ${postData.permalink}`;

      console.log(errorMessage);
      sendErrorMessage(errorMessage);

      return false;
    }

    formattedPosts.push(formattedPost);
  });

  return { originalPosts, formattedPosts };
};

const savePosts = (originalPosts, formattedPosts) => {
  const originalPostsAsJSON = JSON.stringify(originalPosts);
  const formattedPostsAsJSON = JSON.stringify(formattedPosts);

  const postsFolderName = 'posts';

  if (!fs.existsSync(postsFolderName)) {
    fs.mkdirSync(postsFolderName);
  }

  const todayPostsFolderName = getDateAsString();
  const todayPostsFolderPath = `${postsFolderName}/${todayPostsFolderName}`;

  if (!fs.existsSync(todayPostsFolderPath)) {
    fs.mkdirSync(todayPostsFolderPath);
  }

  const originalPostsFileName = `original-posts.json`;
  const originalPostsFilePath = `${todayPostsFolderPath}/${originalPostsFileName}`;
  const formattedPostsFileName = `formatted-posts.json`;
  const formattedPostsFilePath = `${todayPostsFolderPath}/${formattedPostsFileName}`;

  fs.writeFile(originalPostsFilePath, originalPostsAsJSON, 'utf8', () => {
    console.log(`${originalPostsFilePath} was successfully created`);
  });

  fs.writeFile(formattedPostsFilePath, formattedPostsAsJSON, 'utf8', () => {
    console.log(`${formattedPostsFilePath} was successfully created`);
  });
};


export const generateJSON = () => {
  return fetchPosts()
    .then((response) => {
      return formatPosts(response.data);
    })
    .then(({ originalPosts, formattedPosts }) => {
      return savePosts(originalPosts, formattedPosts);
    });
};
