const { generatePostKeyboard } = require('../keyboards');
const { Post } = require('../models');
const { bot } = require('../bot');
const { CHANNELS_INFO, ACTION_NAMES, IS_PRODUCTION, DEVELOPMENT_GROUP_ID } = require('../constants');


const setUpApprovePostRejectionAction = () => {
  bot.action(ACTION_NAMES.approve_post_rejection.regexp, async (context) => {
    const id = context.match[1];
    const callbackQueryId = context.update.callback_query.id;

    const post = await Post.findById(id);

    const channelInfo = CHANNELS_INFO[post.channel];
    const moderationGroupId = IS_PRODUCTION ? channelInfo.moderationGroupId : DEVELOPMENT_GROUP_ID;
    const moderationGroupMessageId = post.moderationGroupMessageId;
    const isCaptionVisible = post.isCaptionVisible;
    const keyboard = generatePostKeyboard(id, isCaptionVisible);

    bot.telegram.editMessageReplyMarkup(moderationGroupId, moderationGroupMessageId, '', keyboard);
    bot.telegram.answerCbQuery(callbackQueryId, '');
  });
};


module.exports = { setUpApprovePostRejectionAction };
