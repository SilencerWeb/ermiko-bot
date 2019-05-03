require('dotenv').config();

const fs = require('fs');
const axios = require('axios');


const getDateAsString = () => {
  const date = new Date();

  const year = date.getUTCFullYear();

  let month = date.getUTCMonth() + 1;
  if (month < 10) month = `0${month}`;

  let day = date.getUTCDate();
  if (day < 10) day = `0${day}`;

  return `${year}-${month}-${day}`;
};

const generateJSON = () => {
  const formattedPosts = [];

  axios.get('https://www.reddit.com/r/aww/top/.json?t=day&limit=100')
    .then((response) => {
      const posts = response.data.data.children;

      posts.forEach((post) => {
        const formattedPost = {};
        formattedPost.title = post.data.title;

        let postData = post.data;
        let postHint = post.data.post_hint;

        if (post.data.post_hint === 'link') {
          if (post.data.crosspost_parent_list) {
            postData = post.data.crosspost_parent_list[0];
            postHint = postData.post_hint === 'link' ? 'image' : postData.post_hint;
          } else {
            postHint = 'image';
          }
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
            if (postData.preview.enabled === true) formattedPost.link = postData.preview.reddit_video_preview.fallback_url;
            break;
        }

        // We don't need to push object if it doesn't have a link
        if (!formattedPost.link) {
          console.log(`Invalid post with the permalink ${postData.permalink}`);
          return;
        }

        formattedPosts.push(formattedPost);
      });

      return formattedPosts;
    })
    .then((formattedPosts) => {
      const formattedPostsAsJSON = JSON.stringify(formattedPosts);

      const fileName = `posts-${getDateAsString()}.json`;

      fs.writeFile(fileName, formattedPostsAsJSON, 'utf8', () => {
        console.log(`${fileName} was successfully created`);
      });
    });
};
