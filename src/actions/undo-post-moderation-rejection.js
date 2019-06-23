const { generateApprovedPostKeyboard, generateDismissedPostKeyboard } = require('../keyboards');
const { getChannel } = require('../utils');
const { Post } = require('../models');
const { bot } = require('../bot');
const { ACTION_NAMES, IS_PRODUCTION, DEVELOPMENT_GROUP_ID } = require('../constants');


const setUpUndoPostModerationRejectionAction = () => {
  bot.action(ACTION_NAMES.undo_post_moderation_rejection.regexp, async (context) => {
    const id = context.match[1];
    const callbackQueryId = context.update.callback_query.id;

    const post = await Post.findById(id);

    const channel = getChannel(post.channel);
    const moderationGroupId = IS_PRODUCTION ? channel.moderationGroupId : DEVELOPMENT_GROUP_ID;
    const moderationGroupMessageId = post.moderationGroupMessageId;
    const keyboard = post.status === 'approved' ? generateApprovedPostKeyboard(id) : generateDismissedPostKeyboard(id);

    context.telegram.editMessageReplyMarkup(moderationGroupId, moderationGroupMessageId, '', keyboard);
    context.telegram.answerCbQuery(callbackQueryId, '');
  });
};


module.exports = { setUpUndoPostModerationRejectionAction };
