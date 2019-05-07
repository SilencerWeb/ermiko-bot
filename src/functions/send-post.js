import fs from 'fs';
import { generateJSON } from './functions';
import { getDateAsString, sendErrorMessage } from '../utils/utils';
import { bot } from '../bot';


export const sendPost = (channel) => {
  const postsFolderName = 'posts';

  const channelPostsFolderPath = `${postsFolderName}/${channel}`;

  const todayPostsFolderName = getDateAsString();
  const todayPostsFolderPath = `${channelPostsFolderPath}/${todayPostsFolderName}`;

  const formattedPostsFileName = `formatted-posts.json`;
  const formattedPostsFilePath = `${todayPostsFolderPath}/${formattedPostsFileName}`;

  fs.access(formattedPostsFilePath, fs.F_OK, (error) => {
    if (error) {
      generateJSON().then(() => sendPost());
    } else {
      fs.readFile(formattedPostsFilePath, 'utf8', (error, posts) => {
        if (error) {
          const errorMessage = `Error with reading file ${formattedPostsFilePath}\n\n${error}`;

          console.log(errorMessage);
          sendErrorMessage(errorMessage);
        } else {
          const postsAsArray = JSON.parse(posts);

          const handleSuccessfulPostsSending = (postIndex) => {
            postsAsArray[postIndex].status = 'sent';

            const postsAsJSON = JSON.stringify(postsAsArray);

            fs.writeFile(formattedPostsFilePath, postsAsJSON, 'utf8', () => {
              console.log(`${formattedPostsFilePath} was successfully rewrote`);
            });
          };

          const handleUnsuccessfulPostsSending = (formattedPostIndex, error) => {
            const errorMessage = `Error with sending post\n\n${error}\n\n${JSON.stringify(postsAsArray[formattedPostIndex])}`;

            console.log(errorMessage);
            sendErrorMessage(errorMessage);

            postsAsArray[formattedPostIndex].status = 'failed';

            const postsAsJSON = JSON.stringify(postsAsArray);

            fs.writeFile(formattedPostsFilePath, postsAsJSON, 'utf8', () => {
              console.log(`${formattedPostsFilePath} was successfully rewrote`);
            });
          };

          const channelUsername = `@${channel}`;

          const postToSendIndex = postsAsArray.findIndex((formattedPost) => formattedPost.status === 'not sent');
          const postToSend = postsAsArray[postToSendIndex];

          const postTitle = postToSend.title;
          const postLink = postToSend.link;

          if (postToSend.type === 'video') {
            bot.sendVideo(channelUsername, postLink, { caption: postTitle })
              .then(() => handleSuccessfulPostsSending(postToSendIndex))
              .catch((error) => handleUnsuccessfulPostsSending(postToSendIndex, error));
          } else if (postToSend.type === 'image') {
            bot.sendPhoto(channelUsername, postLink, { caption: postTitle })
              .then(() => handleSuccessfulPostsSending(postToSendIndex))
              .catch((error) => handleUnsuccessfulPostsSending(postToSendIndex, error));
          }
        }
      });
    }
  });
};
