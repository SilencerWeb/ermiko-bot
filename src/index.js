require('dotenv').config();

const fs = require('fs');

const Telegram = require('telegraf/telegram');
const axios = require('axios');


const telegram = new Telegram(process.env.BOT_TOKEN);


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
  return axios.get('https://www.reddit.com/r/aww/top/.json?t=day&limit=100')
    .then((response) => {
      const posts = response.data.data.children;
      const formattedPosts = [];

      posts.forEach((post) => {
        const formattedPost = {};
        formattedPost.title = post.data.title;

        let postData = post.data;
        let postHint = post.data.post_hint;

        if (post.data.post_hint === 'link') {
          if (post.data.crosspost_parent_list) {
            postData = post.data.crosspost_parent_list[0];
            postHint = postData.post_hint === 'link' ? postData.domain === 'i.imgur.com' ? 'rich:video' : 'image' : postData.post_hint;
          } else if (post.data.domain === 'i.imgur.com') {
            postHint = 'rich:video';
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

      const postsFileName = `posts-${getDateAsString()}.json`;
      const formattedPostsFileName = `formatted-posts-${getDateAsString()}.json`;

      fs.writeFile(postsFileName, postsAsJSON, 'utf8', () => {
        console.log(`${postsFileName} was successfully created`);
      });

      fs.writeFile(formattedPostsFileName, formattedPostsAsJSON, 'utf8', () => {
        console.log(`${formattedPostsFileName} was successfully created`);
      });
    });
};

const sendPosts = () => {
  const formattedPostsFileName = `formatted-posts-${getDateAsString()}.json`;

  fs.access(formattedPostsFileName, fs.F_OK, (error) => {
    if (error) {
      generateJSON().then(() => sendPosts());
    } else {
      fs.readFile(formattedPostsFileName, 'utf8', (error, posts) => {
        if (error) {
          console.log(error);
        } else {
          const postsAsArray = JSON.parse(posts);

          postsAsArray.forEach((post) => {
            const postTitle = post.title;
            const postLink = post.link;

            if (post.type === 'video') {
              telegram.sendVideo(554773669, postLink, { caption: postTitle }).catch((error) => {
                console.log(post);
                console.log(error);
              });
            } else if (post.type === 'image') {
              telegram.sendPhoto(554773669, postLink, { caption: postTitle }).catch((error) => {
                console.log(post);
                console.log(error);
              });
            }
          });
        }
      });
    }
  });
};
