import fs from 'fs';
import { generateJSON } from './functions';
import { getDateAsString, sendErrorMessage } from '../utils/utils';
import { bot } from '../bot';
import { AWW_SO_CUTE_CHANNEL_ID } from '../constants';


export const sendPosts = () => {
  const postsFolderName = 'posts';

  const todayPostsFolderName = getDateAsString();
  const todayPostsFolderPath = `${postsFolderName}/${todayPostsFolderName}`;

  const formattedPostsFileName = `formatted-posts.json`;
  const formattedPostsFilePath = `${todayPostsFolderPath}/${formattedPostsFileName}`;

  fs.access(formattedPostsFilePath, fs.F_OK, (error) => {
    if (error) {
      generateJSON().then(() => sendPosts());
    } else {
      fs.readFile(formattedPostsFilePath, 'utf8', (error, formattedPosts) => {
        if (error) {
          const errorMessage = `Error with reading file ${formattedPostsFilePath}\n\n${error}`;

          console.log(errorMessage);
          sendErrorMessage(errorMessage);
        } else {
          const formattedPostsAsArray = JSON.parse(formattedPosts);

          const handleSuccessfulPostsSending = (postIndex) => {
            formattedPostsAsArray[postIndex].status = 'sent';

            const formattedPostsAsJSON = JSON.stringify(formattedPostsAsArray);

            fs.writeFile(formattedPostsFilePath, formattedPostsAsJSON, 'utf8', () => {
              console.log(`${formattedPostsFilePath} was successfully rewrote`);
            });
          };

          const handleUnsuccessfulPostsSending = (formattedPostIndex, error) => {
            const errorMessage = `Error with sending post\n\n${error}\n\n${JSON.stringify(formattedPostsAsArray[formattedPostIndex])}`;

            console.log(errorMessage);
            sendErrorMessage(errorMessage);

            formattedPostsAsArray[formattedPostIndex].status = 'failed';

            const formattedPostsAsJSON = JSON.stringify(formattedPostsAsArray);

            fs.writeFile(formattedPostsFilePath, formattedPostsAsJSON, 'utf8', () => {
              console.log(`${formattedPostsFilePath} was successfully rewrote`);
            });
          };

          formattedPostsAsArray.forEach((formattedPost, formattedPostIndex) => {
            if (formattedPost.status === 'sent') return;

            const postTitle = formattedPost.title;
            const postLink = formattedPost.link;

            if (formattedPost.type === 'video') {
              bot.sendVideo(AWW_SO_CUTE_CHANNEL_ID, postLink, { caption: postTitle })
                .then(() => handleSuccessfulPostsSending(formattedPostIndex))
                .catch((error) => handleUnsuccessfulPostsSending(formattedPostIndex, error));
            } else if (formattedPost.type === 'image') {
              bot.sendPhoto(AWW_SO_CUTE_CHANNEL_ID, postLink, { caption: postTitle })
                .then(() => handleSuccessfulPostsSending(formattedPostIndex))
                .catch((error) => handleUnsuccessfulPostsSending(formattedPostIndex, error));
            }
          });
        }
      });
    }
  });
};
