const { generatePostKeyboard } = require('../keyboards');
const { getChannel } = require('../utils');
const { Post } = require('../models');
const { bot } = require('../bot');
const { ACTION_NAMES, IS_PRODUCTION, DEVELOPMENT_GROUP_ID } = require('../constants');


const setUpUndoPostModerationConfirmationAction = () => {
  bot.action(ACTION_NAMES.undo_post_moderation_confirmation.regexp, (context) => {
    const id = context.match[1];
    const callbackQueryId = context.update.callback_query.id;

    Post.findByIdAndUpdate(id, { status: 'waitingForModeration' }, async (error) => {
      if (error) {
        console.log(`Error on changing post's "status" with ID ${id} to "waitingForModeration"!`);
        console.log(`Error message: ${error.message}`);
        context.telegram.answerCbQuery(callbackQueryId, `Couldn't undo post moderation. Error: ${error.message}`);
      } else {
        const post = await Post.findById(id);

        const channel = getChannel(post.channelName);
        const moderationGroupId = IS_PRODUCTION ? channel.moderationGroupId : DEVELOPMENT_GROUP_ID;
        const moderationGroupMessageId = post.moderationGroupMessageId;
        const isCaptionVisible = post.isCaptionVisible;
        const keyboard = generatePostKeyboard(id, isCaptionVisible);

        context.telegram.editMessageReplyMarkup(moderationGroupId, moderationGroupMessageId, '', keyboard);
        context.telegram.answerCbQuery(callbackQueryId, 'Post was successfully returned to the moderation stage');
      }
    });
  });
};


module.exports = { setUpUndoPostModerationConfirmationAction };
