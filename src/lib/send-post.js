const { Post } = require('../models');
const { generatePostKeyboard } = require('../keyboards');
const { bot } = require('../bot');


const sendPost = (post, chat, isChatModerationGroup) => {
  const { _id, title, link, type, isCaptionVisible } = post;

  const options = {};
  if (title && isCaptionVisible) {
    options.caption = title;
  }

  if (isChatModerationGroup === true) {
    options.reply_markup = generatePostKeyboard(_id, isCaptionVisible);
  }

  if (type === 'video') {
    return bot.telegram.sendVideo(chat, link, options)
      .then((message) => {
        const updateOptions = {};

        if (isChatModerationGroup === true) {
          updateOptions.moderationGroupMessageId = message.message_id;
        } else {
          updateOptions.status = 'published';
        }

        Post.findByIdAndUpdate(_id, updateOptions, (error) => {
          if (error) {
            console.log(`Error on changing post's "moderationGroupMessageId" with ID ${_id} to "${moderationGroupMessageId}"!`);
            console.log(`Error message: ${error.message}`);
          }
        });
      })
      .catch((error) => {
        console.log(`Error on sending post with ID ${_id} to moderation group!`);
        console.log(`Error message: ${error.message}`);
      });
  } else if (type === 'image') {
    return bot.telegram.sendPhoto(chat, link, options)
      .then((message) => {
        const updateOptions = {};

        if (isChatModerationGroup === true) {
          updateOptions.moderationGroupMessageId = message.message_id;
        } else {
          updateOptions.status = 'published';
        }

        Post.findByIdAndUpdate(_id, updateOptions, (error) => {
          if (error) {
            console.log(`Error on changing post's "moderationGroupMessageId" with ID ${_id} to "${moderationGroupMessageId}"!`);
            console.log(`Error message: ${error.message}`);
          }
        });
      })
      .catch((error) => {
        console.log(`Error on sending post with ID ${_id} to moderation group!`);
        console.log(`Error message: ${error.message}`);
      });
  }
};


module.exports = { sendPost };
