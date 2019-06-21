const { Post } = require('../models');
const { bot } = require('../bot');
const { CHANNELS_INFO, ACTION_NAMES } = require('../constants');


const setUpDismissPostConfirmationAction = () => {
  bot.action(ACTION_NAMES.dismiss_post_confirmation.regexp, (context) => {
    const id = context.match[1];
    const callbackQueryId = context.update.callback_query.id;

    Post.findByIdAndUpdate(id, { status: 'dismissed' }, async (error) => {
      if (error) {
        console.log(`Error on changing post's "status" with ID ${id} to "dismissed"!`);
        console.log(`Error message: ${error.message}`);
        bot.telegram.answerCbQuery(callbackQueryId, `Couldn't dismiss post. Error: ${error.message}`);
      } else {
        const post = await Post.findById(id);

        const channelInfo = CHANNELS_INFO[post.channel];
        const moderationGroupId = channelInfo.moderationGroupId;
        const moderationGroupMessageId = post.moderationGroupMessageId;

        bot.telegram.deleteMessage(moderationGroupId, moderationGroupMessageId);
        bot.telegram.answerCbQuery(callbackQueryId, 'Post was successfully dismissed');
      }
    });
  });
};


module.exports = { setUpDismissPostConfirmationAction };
