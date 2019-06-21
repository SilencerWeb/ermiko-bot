const { Post } = require('../models');
const { generatePostKeyboard } = require('../keyboards');
const { bot } = require('../bot');
const { CHANNELS_INFO, ACTION_NAMES, IS_PRODUCTION, DEVELOPMENT_GROUP_ID } = require('../constants');


const setUpDismissPostRejectionAction = () => {
  bot.action(ACTION_NAMES.dismiss_post_rejection.regexp, async (context) => {
    const id = context.match[1];
    const callbackQueryId = context.update.callback_query.id;

    const post = await Post.findById(id);

    const channelInfo = CHANNELS_INFO[post.channel];
    const moderationGroupId = IS_PRODUCTION ? channelInfo.moderationGroupId : DEVELOPMENT_GROUP_ID;
    const moderationGroupMessageId = post.moderationGroupMessageId;
    const isCaptionVisible = post.isCaptionVisible;

    bot.telegram.editMessageReplyMarkup(moderationGroupId, moderationGroupMessageId, '', generatePostKeyboard(id, isCaptionVisible));
    bot.telegram.answerCbQuery(callbackQueryId, '');
  });
};


module.exports = { setUpDismissPostRejectionAction };
