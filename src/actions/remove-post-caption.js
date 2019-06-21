const { Post } = require('../models');
const { generatePostKeyboard } = require('../keyboards');
const { bot } = require('../bot');
const { CHANNELS_INFO, ACTION_NAMES } = require('../constants');


const setUpRemovePostCaptionAction = () => {
  bot.action(ACTION_NAMES.remove_post_caption.regexp, (context) => {
    const id = context.match[1];
    const callbackQueryId = context.update.callback_query.id;

    Post.findByIdAndUpdate(id, { isCaptionVisible: false }, async (error) => {
      if (error) {
        console.log(`Error on changing post's "isCaptionVisible" with ID ${id} to "false"`);
        console.log(`Error message: ${error.message}`);
        bot.telegram.answerCbQuery(callbackQueryId, `Couldn't remove caption. Error: ${error.message}`);
      } else {
        const post = await Post.findById(id);

        const channelInfo = CHANNELS_INFO[post.channel];
        const moderationGroupId = channelInfo.moderationGroupId;
        const moderationGroupMessageId = post.moderationGroupMessageId;

        bot.telegram.editMessageCaption(moderationGroupId, moderationGroupMessageId, '', '');
        bot.telegram.editMessageReplyMarkup(moderationGroupId, moderationGroupMessageId, '', generatePostKeyboard(id, false));
        bot.telegram.answerCbQuery(callbackQueryId, 'Caption was successfully removed');
      }
    });
  });
};


module.exports = { setUpRemovePostCaptionAction };
