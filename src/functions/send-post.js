import { formatPost } from './functions';
import { bot } from '../bot';


export const sendPost = (post, chat) => {
  const formattedPost = formatPost(post);

  const postTitle = formattedPost.title;
  const postLink = formattedPost.link;

  const options = {
    caption: postTitle,
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Approve',
          callback_data: 'approve',
        },
        {
          text: 'Dismiss',
          callback_data: 'dismiss',
        },
      ]],
    },
  };

  if (formattedPost.type === 'video') {
    bot.sendVideo(chat, postLink, options).catch((error) => {
      console.log(`Error on sending post to moderation group!`);
      console.log(`Error: ${error.message}`);
    });
  } else if (formattedPost.type === 'image') {
    bot.sendPhoto(chat, postLink, options).catch((error) => {
      console.log(`Error on sending post to moderation group!`);
      console.log(`Error: ${error.message}`);
    });
  }
};
