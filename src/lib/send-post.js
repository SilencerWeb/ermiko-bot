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
            if (isChatModerationGroup === true) {
              console.log(`Error on changing post's "moderationGroupMessageId" with ID ${_id} to "${updateOptions.moderationGroupMessageId}"!`);
              console.log(`Error message: ${error.message}`);
            } else {
              console.log(`Error on changing post's "status" with ID ${_id} to "${updateOptions.status}"!`);
              console.log(`Error message: ${error.message}`);
            }
          }
        });
      })
      .catch((error) => {
        Post.findByIdAndUpdate(_id, { status: 'failed', error: error.message }, (error) => {
          if (error) {
            console.log(`Error on changing post's "status" with ID ${_id} to "failed" and "error" to "${error.message}"!`);
            console.log(`Error message: ${error.message}`);
          }
        });

        if (isChatModerationGroup === true) {
          console.log(`Error on sending post with ID ${_id} to moderation group!`);
          console.log(`Error message: ${error.message}`);
        } else {
          console.log(`Error on sending post with ID ${_id} to the channel "${chat}"!`);
          console.log(`Error message: ${error.message}`);
        }
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
            if (isChatModerationGroup === true) {
              console.log(`Error on changing post's "moderationGroupMessageId" with ID ${_id} to "${updateOptions.moderationGroupMessageId}"!`);
              console.log(`Error message: ${error.message}`);
            } else {
              console.log(`Error on changing post's "status" with ID ${_id} to "${updateOptions.status}"!`);
              console.log(`Error message: ${error.message}`);
            }
          }
        });
      })
      .catch((error) => {
        Post.findByIdAndUpdate(_id, { status: 'failed', error: error.message }, (error) => {
          if (error) {
            console.log(`Error on changing post's "status" with ID ${_id} to "failed" and "error" to "${error.message}"!`);
            console.log(`Error message: ${error.message}`);
          }
        });

        if (isChatModerationGroup === true) {
          console.log(`Error on sending post with ID ${_id} to moderation group!`);
          console.log(`Error message: ${error.message}`);
        } else {
          console.log(`Error on sending post with ID ${_id} to the channel "${chat}"!`);
          console.log(`Error message: ${error.message}`);
        }
      });
  }
};


module.exports = { sendPost };
