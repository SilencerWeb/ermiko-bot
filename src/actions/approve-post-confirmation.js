const { generateApprovedPostKeyboard } = require('../keyboards');
const { getChannel } = require('../utils');
const { Post } = require('../models');
const { bot } = require('../bot');
const { ACTION_NAMES, IS_PRODUCTION, DEVELOPMENT_GROUP_ID } = require('../constants');


const setUpApprovePostConfirmationAction = () => {
  bot.action(ACTION_NAMES.approve_post_confirmation.regexp, (context) => {
    const id = context.match[1];
    const callbackQueryId = context.update.callback_query.id;

    Post.findByIdAndUpdate(id, { status: 'approved' }, async (error) => {
      if (error) {
        console.log(`Error on changing post's "status" with ID ${id} to "approved"!`);
        console.log(`Error message: ${error.message}`);
        context.telegram.answerCbQuery(callbackQueryId, `Couldn't approve post. Error: ${error.message}`);
      } else {
        const post = await Post.findById(id);

        const channel = getChannel(post.channelName);
        const moderationGroupId = IS_PRODUCTION ? channel.moderationGroupId : DEVELOPMENT_GROUP_ID;
        const moderationGroupMessageId = post.moderationGroupMessageId;
        const keyboard = generateApprovedPostKeyboard(id);

        context.telegram.editMessageReplyMarkup(moderationGroupId, moderationGroupMessageId, '', keyboard);
        context.telegram.answerCbQuery(callbackQueryId, 'Post was successfully approved');
      }
    });
  });
};


module.exports = { setUpApprovePostConfirmationAction };
