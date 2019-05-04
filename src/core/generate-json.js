import fs from 'fs';
import axios from 'axios';
import { getDateAsString } from '../utils/utils';


export const generateJSON = () => {
  return axios.get('https://www.reddit.com/r/aww/top/.json?t=day&limit=100')
    .then((response) => {
      const posts = response.data.data.children;
      const formattedPosts = [];

      posts.forEach((post) => {
        const formattedPost = {};
        formattedPost.title = post.data.title;
        formattedPost.status = 'pending';

        let postData = null;
        let postHint = null;

        if (post.data.post_hint === 'link') {
          if (post.data.crosspost_parent_list) {
            postData = post.data.crosspost_parent_list[0];

            if (postData.post_hint === 'link') {
              postHint = postData.domain === 'i.imgur.com' ? 'rich:video' : 'image';
            } else {
              postHint = postData.post_hint;
            }
          } else if (post.data.domain === 'i.imgur.com') {
            postData = post.data;
            postHint = 'rich:video';
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
            formattedPost.type = 'image';
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
          console.log(`Invalid post with the permalink ${postData.permalink}`);
          return;
        }

        formattedPosts.push(formattedPost);
      });

      return { posts, formattedPosts };
    })
    .then(({ posts, formattedPosts }) => {
      const postsAsJSON = JSON.stringify(posts);
      const formattedPostsAsJSON = JSON.stringify(formattedPosts);

      const folderName = getDateAsString();

      if (!fs.existsSync('posts')) {
        fs.mkdirSync('posts');
      }

      if (!fs.existsSync(`posts/${folderName}`)) {
        fs.mkdirSync(`posts/${folderName}`);
      }

      const postsFileName = `original-posts.json`;
      const formattedPostsFileName = `formatted-posts.json`;

      fs.writeFile(`posts/${folderName}/${postsFileName}`, postsAsJSON, 'utf8', () => {
        console.log(`posts/${folderName}/${postsFileName} was successfully created`);
      });

      fs.writeFile(`posts/${folderName}/${formattedPostsFileName}`, formattedPostsAsJSON, 'utf8', () => {
        console.log(`posts/${folderName}/${formattedPostsFileName} was successfully created`);
      });
    });
};
