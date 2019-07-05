const { Post } = require('../models');
const { bot } = require('../bot');
const { ADMIN_IDS, CHANNELS, IS_PRODUCTION } = require('../constants');


const setUpStatsCommand = () => {
  bot.command('stats', async (context) => {
    const messageFromId = context.update.message.from.id;
    const messageId = context.update.message.message_id;

    if (!ADMIN_IDS.some((adminId) => adminId === messageFromId.toString())) return context.deleteMessage(messageId);

    let message = '';

    await Promise.all(
      CHANNELS.map(async (channel) => {
        const searchQuery = IS_PRODUCTION ? { channelName: channel.name, status: 'approved' } : { status: 'approved' };
        const approvedPostsCount = await Post.countDocuments(searchQuery);

        message += `*Approved* posts in the channel *${channel.name}*: *${approvedPostsCount}*\n`;
      }),
    );

    context.replyWithMarkdown(message.trim(), { reply_to_message_id: messageId })
      .then((message) => {
        const messageId = message.message_id;
        const replyToMessageId = message.reply_to_message.message_id;

        setTimeout(() => {
          context.deleteMessage(messageId);
          context.deleteMessage(replyToMessageId);
        }, 5000); // 5000 milliseconds = 5 seconds
      });
  });
};


module.exports = { setUpStatsCommand };
