const { bot } = require('../bot');


const generateReplyMarkup = (id) => {
  return {
    inline_keyboard: [
      [
        {
          text: 'Remove caption',
          callback_data: `remove_post_caption_${id}`,
        },
      ],
      [
        {
          text: 'Approve',
          callback_data: `approve_post_${id}`,
        },
        {
          text: 'Dismiss',
          callback_data: `dismiss_post_${id}`,
        },
      ],
    ],
  };
};


const sendPost = (post, chat, isChatModerationGroup) => {
  const { _id, title, link, type } = post;

  const options = {};
  if (title) {
    options.caption = title;
  }

  if (isChatModerationGroup === true) {
    options.reply_markup = generateReplyMarkup(_id);
  }

  if (type === 'video') {
    bot.telegram.sendVideo(chat, link, options).catch((error) => {
      console.log(`Error on sending post with ID ${_id} to moderation group!`);
      console.log(`Error message: ${error.message}`);
    });
  } else if (type === 'image') {
    bot.telegram.sendPhoto(chat, link, options).catch((error) => {
      console.log(`Error on sending post with ID ${_id} to moderation group!`);
      console.log(`Error message: ${error.message}`);
    });
  }
};


module.exports = { sendPost };
