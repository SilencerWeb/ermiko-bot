const { Post } = require('../models');
const { generatePostDismissConfirmationKeyboard } = require('../keyboards');
const { bot } = require('../bot');
const { CHANNELS_INFO, ACTION_NAMES, IS_PRODUCTION, DEVELOPMENT_GROUP_ID } = require('../constants');


const setUpDismissPostAction = () => {
  bot.action(ACTION_NAMES.dismiss_post.regexp, async (context) => {
    const id = context.match[1];
    const callbackQueryId = context.update.callback_query.id;

    const post = await Post.findById(id);

    const channelInfo = CHANNELS_INFO[post.channel];
    const moderationGroupId = IS_PRODUCTION ? channelInfo.moderationGroupId : DEVELOPMENT_GROUP_ID;
    const moderationGroupMessageId = post.moderationGroupMessageId;

    bot.telegram.editMessageReplyMarkup(moderationGroupId, moderationGroupMessageId, '', generatePostDismissConfirmationKeyboard(id));
    bot.telegram.answerCbQuery(callbackQueryId, '');
  });
};


module.exports = { setUpDismissPostAction };
