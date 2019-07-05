const { Post } = require('../models');
const { generatePostKeyboard, generatePublishedPostKeyboard } = require('../keyboards');
const { getChannel, getMessageLink } = require('../utils');
const { bot } = require('../bot');
const { IS_PRODUCTION, DEVELOPMENT_GROUP_ID } = require('../constants');


const sendPhotoOrVideo = (chat, link, options = {}, type) => {
  if (type === 'image') {
    return bot.telegram.sendPhoto(chat, link, options);
  } else if (type === 'video') {
    return bot.telegram.sendVideo(chat, link, options);
  } else {
    throw new Error('Wrong post type');
  }
};


const sendPost = (post, chat, isChatModerationGroup) => {
  const { _id, title, link, type, originalPostLink, isCaptionVisible } = post;

  const options = {};
  if (title && isCaptionVisible) {
    const titleWithPostLink = `${title}\n\n${originalPostLink}`;
    options.caption = IS_PRODUCTION ? title : titleWithPostLink;
  }

  if (isChatModerationGroup === true) {
    options.reply_markup = generatePostKeyboard(_id, isCaptionVisible);
  }

  return sendPhotoOrVideo(chat, link, options, type)
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
        } else {
          if (isChatModerationGroup !== true) {
            const channel = getChannel(post.channelName);
            const moderationGroupId = IS_PRODUCTION ? channel.moderationGroupId : DEVELOPMENT_GROUP_ID;
            const moderationGroupMessageId = post.moderationGroupMessageId;
            const messageLink = getMessageLink(message.chat.id, message.message_id);
            const keyboard = generatePublishedPostKeyboard(messageLink);

            bot.telegram.editMessageReplyMarkup(moderationGroupId, moderationGroupMessageId, '', keyboard);
          }
        }
      });
    })
    .catch((error) => {
      Post.findByIdAndUpdate(_id, { status: 'failed', errorMessage: error.message }, (error) => {
        if (error) {
          console.log(`Error on changing post's "status" with ID ${_id} to "failed" and "errorMessage" to "${error.message}"!`);
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
};


module.exports = { sendPost };
