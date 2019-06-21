const { Post } = require('../models');
const { generatePostApproveConfirmationKeyboard } = require('../keyboards');
const { bot } = require('../bot');
const { CHANNELS_INFO, ACTION_NAMES, IS_PRODUCTION, DEVELOPMENT_GROUP_ID } = require('../constants');


const setUpApprovePostAction = () => {
  bot.action(ACTION_NAMES.approve_post.regexp, async (context) => {
    const id = context.match[1];
    const callbackQueryId = context.update.callback_query.id;

    const post = await Post.findById(id);

    const channelInfo = CHANNELS_INFO[post.channel];
    const moderationGroupId = IS_PRODUCTION ? channelInfo.moderationGroupId : DEVELOPMENT_GROUP_ID;
    const moderationGroupMessageId = post.moderationGroupMessageId;

    bot.telegram.editMessageReplyMarkup(moderationGroupId, moderationGroupMessageId, '', generatePostApproveConfirmationKeyboard(id));
    bot.telegram.answerCbQuery(callbackQueryId, '');
  });
};


module.exports = { setUpApprovePostAction };
