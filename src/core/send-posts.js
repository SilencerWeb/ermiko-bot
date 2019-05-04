require('dotenv').config();

import fs from 'fs';
import Telegram from 'telegraf/telegram';
import { getDateAsString } from '../utils/utils';
import { generateJSON } from './generate-json';


const telegram = new Telegram(process.env.BOT_TOKEN);


export const sendPosts = () => {
  const folderName = getDateAsString();
  const formattedPostsFileName = `formatted-posts.json`;

  fs.access(`posts/${folderName}/${formattedPostsFileName}`, fs.F_OK, (error) => {
    if (error) {
      generateJSON().then(() => sendPosts());
    } else {
      fs.readFile(`posts/${folderName}/${formattedPostsFileName}`, 'utf8', (error, posts) => {
        if (error) {
          console.log(error);
        } else {
          const postsAsArray = JSON.parse(posts);

          postsAsArray.forEach((post, index) => {
            if (post.status === 'sent') return;

            const postTitle = post.title;
            const postLink = post.link;

            if (post.type === 'video') {
              telegram.sendVideo(554773669, postLink, { caption: postTitle })
                .then(() => {
                  postsAsArray[index].status = 'sent';

                  const postsAsJSON = JSON.stringify(postsAsArray);
                  const formattedPostsFileName = `formatted-posts.json`;

                  fs.writeFile(`posts/${folderName}/${formattedPostsFileName}`, postsAsJSON, 'utf8', () => {
                    console.log(`posts/${folderName}/${formattedPostsFileName} was successfully rewrote`);
                  });
                })
                .catch((error) => {
                  console.log(post);
                  console.log(error);

                  postsAsArray[index].status = 'failed';

                  const postsAsJSON = JSON.stringify(postsAsArray);
                  const formattedPostsFileName = `formatted-posts.json`;

                  fs.writeFile(`posts/${folderName}/${formattedPostsFileName}`, postsAsJSON, 'utf8', () => {
                    console.log(`posts/${folderName}/${formattedPostsFileName} was successfully rewrote`);
                  });
                });
            } else if (post.type === 'image') {
              telegram.sendPhoto(554773669, postLink, { caption: postTitle })
                .then(() => {
                  postsAsArray[index].status = 'sent';

                  const postsAsJSON = JSON.stringify(postsAsArray);
                  const formattedPostsFileName = `formatted-posts.json`;

                  fs.writeFile(`posts/${folderName}/${formattedPostsFileName}`, postsAsJSON, 'utf8', () => {
                    console.log(`posts/${folderName}/${formattedPostsFileName} was successfully rewrote`);
                  });
                })
                .catch((error) => {
                  console.log(post);
                  console.log(error);

                  postsAsArray[index].status = 'failed';

                  const postsAsJSON = JSON.stringify(postsAsArray);
                  const formattedPostsFileName = `formatted-posts.json`;

                  fs.writeFile(`posts/${folderName}/${formattedPostsFileName}`, postsAsJSON, 'utf8', () => {
                    console.log(`posts/${folderName}/${formattedPostsFileName} was successfully rewrote`);
                  });
                });
            }
          });
        }
      });
    }
  });
};
