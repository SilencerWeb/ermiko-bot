const { generateDismissedPostKeyboard } = require('../keyboards');
const { getChannel } = require('../utils');
const { Post } = require('../models');
const { bot } = require('../bot');
const { ACTION_NAMES, IS_PRODUCTION, DEVELOPMENT_GROUP_ID } = require('../constants');


const setUpDismissPostConfirmationAction = () => {
  bot.action(ACTION_NAMES.dismiss_post_confirmation.regexp, (context) => {
    const id = context.match[1];
    const callbackQueryId = context.update.callback_query.id;

    Post.findByIdAndUpdate(id, { status: 'dismissed' }, async (error) => {
      if (error) {
        console.log(`Error on changing post's "status" with ID ${id} to "dismissed"!`);
        console.log(`Error message: ${error.message}`);
        context.telegram.answerCbQuery(callbackQueryId, `Couldn't dismiss post. Error: ${error.message}`);
      } else {
        const post = await Post.findById(id);

        const channel = getChannel(post.channel);
        const moderationGroupId = IS_PRODUCTION ? channel.moderationGroupId : DEVELOPMENT_GROUP_ID;
        const moderationGroupMessageId = post.moderationGroupMessageId;
        const keyboard = generateDismissedPostKeyboard(id);

        context.telegram.editMessageReplyMarkup(moderationGroupId, moderationGroupMessageId, '', keyboard);
        context.telegram.answerCbQuery(callbackQueryId, 'Post was successfully dismissed');
      }
    });
  });
};


module.exports = { setUpDismissPostConfirmationAction };
