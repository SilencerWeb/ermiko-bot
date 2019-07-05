const axios = require('axios');
const { createPost, formatPost, sendPostToModerationGroup } = require('../lib');
const { Post } = require('../models');
const { bot } = require('../bot');
const { isRedditSubredditURL } = require('../utils');
const { CHANNELS, IS_PRODUCTION, DEVELOPMENT_CHANNEL_ID } = require('../constants');


const setUpNewTextMessageMiddleware = () => {
  bot.on('text', async (context) => {
    const replyToMessage = context.update.message.reply_to_message;

    if (replyToMessage) {
      const moderationGroupId = context.update.message.chat.id;
      const channel = IS_PRODUCTION ? CHANNELS.find((channel) => channel.moderationGroupId === moderationGroupId.toString()) : DEVELOPMENT_CHANNEL_ID;
      if (!channel) return;

      const channelName = IS_PRODUCTION ? channel.name : channel;
      const replyToMessageId = replyToMessage.message_id;
      const post = await Post.findOne({ channelName: channelName, moderationGroupMessageId: replyToMessageId });
      if (!post || post.status !== 'waitingForModeration') return;

      const newTitle = context.update.message.text.trim();
      const replyMarkup = replyToMessage.reply_markup;
      if (newTitle === post.title) return;

      return Post.findByIdAndUpdate(post._id, { title: newTitle }, (error) => {
        if (error) {
          console.log(`Error on changing post's "title" with ID ${id} to "${newTitle}"!`);
          console.log(`Error message: ${error.message}`);
        } else {
          context.telegram.editMessageCaption(moderationGroupId, replyToMessageId, '', newTitle, { reply_markup: replyMarkup });

          setTimeout(() => {
            context.telegram.deleteMessage(moderationGroupId, context.update.message.message_id);
          }, 5000); // 5000 milliseconds = 5 seconds
        }
      });
    } else {
      const messageText = context.update.message.text;

      if (isRedditSubredditURL(messageText)) {
        const response = await axios.get(`${messageText}.json`)
          .catch((error) => {
            console.log(`Error on fetching a post by url ${messageText}!`);
            console.log(`Error message: ${error.message}`);
          });

        const post = response.data[0].data.children[0];

        const formattedPost = formatPost(post);
        if (!formattedPost) return context.deleteMessage(context.update.message.message_id);

        const postInDatabase = await Post.findOne({ originalPostLink: formattedPost.originalPostLink });
        if (postInDatabase) return context.deleteMessage(context.update.message.message_id); // We don't need to save the same post twice

        const channel = IS_PRODUCTION ? CHANNELS.find((channel) => channel.subreddit === post.data.subreddit) : DEVELOPMENT_CHANNEL_ID;
        formattedPost.channelName = IS_PRODUCTION ? channel.name : channel;

        if (IS_PRODUCTION && channel.moderationGroupId !== context.update.message.chat.id) return context.deleteMessage(context.update.message.message_id); // We don't need to save the post from the wrong subreddit

        return createPost(formattedPost)
          .then((savedPost) => {
            sendPostToModerationGroup(savedPost, savedPost.channelName);
            context.deleteMessage(context.update.message.message_id);
          })
          .catch((error) => {
            console.log('Error on saving new post!');
            console.log(`Error message: ${error.message}`);
          });
      } else {
        return context.deleteMessage(context.update.message.message_id);
      }
    }
  });
};


module.exports = { setUpNewTextMessageMiddleware };
