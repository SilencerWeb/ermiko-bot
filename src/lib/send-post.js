const { telegramBot } = require('../bot');


const sendPost = (post, chat, isChatModerationGroup) => {
  const postTitle = post.title;
  const postLink = post.link;

  const options = {};

  if (postTitle) {
    options.caption = postTitle;
  }

  if (isChatModerationGroup === true) {
    options.reply_markup = {
      inline_keyboard: [
        [
          {
            text: 'Remove caption',
            callback_data: `remove_post_caption_${post._id}`,
          },
        ],
        [
          {
            text: 'Approve',
            callback_data: `approve_post_${post._id}`,
          },
          {
            text: 'Dismiss',
            callback_data: `dismiss_post_${post._id}`,
          },
        ],
      ],
    };
  }

  if (post.type === 'video') {
    telegramBot.sendVideo(chat, postLink, options).catch((error) => {
      console.log(`Error on sending post to moderation group!`);
      console.log(`Error: ${error.message}`);
    });
  } else if (post.type === 'image') {
    telegramBot.sendPhoto(chat, postLink, options).catch((error) => {
      console.log(`Error on sending post to moderation group!`);
      console.log(`Error: ${error.message}`);
    });
  }
};


module.exports = { sendPost };
