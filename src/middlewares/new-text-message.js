const { Post } = require('../models');
const { bot } = require('../bot');
const { CHANNELS, IS_PRODUCTION, DEVELOPMENT_CHANNEL_ID } = require('../constants');


const setUpNewTextMessageMiddleware = () => {
  bot.on('text', async (context) => {
    const replyToMessage = context.update.message.reply_to_message;
    if (!replyToMessage) return;

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

    Post.findByIdAndUpdate(post._id, { title: newTitle }, (error) => {
      if (error) {
        console.log(`Error on changing post's "title" with ID ${id} to "${newTitle}"!`);
        console.log(`Error message: ${error.message}`);
      } else {
        context.telegram.editMessageCaption(moderationGroupId, replyToMessageId, '', newTitle, { reply_markup: replyMarkup });
        context.telegram.deleteMessage(moderationGroupId, context.update.message.message_id);
      }
    });
  });
};


module.exports = { setUpNewTextMessageMiddleware };
