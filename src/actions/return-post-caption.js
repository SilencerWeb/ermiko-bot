const { Post } = require('../models');
const { generatePostKeyboard } = require('../keyboards');
const { bot } = require('../bot');
const { CHANNELS_INFO, ACTION_NAMES } = require('../constants');


const setUpReturnPostCaptionAction = () => {
  bot.action(ACTION_NAMES.return_post_caption.regexp, (context) => {
    const id = context.match[1];
    const callbackQueryId = context.update.callback_query.id;

    Post.findByIdAndUpdate(id, { isCaptionVisible: true }, async (error) => {
      if (error) {
        console.log(`Error on changing post's "isCaptionVisible" with ID ${id} to "true"`);
        console.log(`Error message: ${error.message}`);
        bot.telegram.answerCbQuery(callbackQueryId, `Couldn't return caption. Error: ${error.message}`);
      } else {
        const post = await Post.findById(id);

        const title = post.title;

        const channelInfo = CHANNELS_INFO[post.channel];
        const moderationGroupId = channelInfo.moderationGroupId;
        const moderationGroupMessageId = post.moderationGroupMessageId;

        bot.telegram.editMessageCaption(moderationGroupId, moderationGroupMessageId, '', title);
        bot.telegram.editMessageReplyMarkup(moderationGroupId, moderationGroupMessageId, '', generatePostKeyboard(id, true));
        bot.telegram.answerCbQuery(callbackQueryId, 'Caption was successfully returned');
      }
    });
  });
};


module.exports = { setUpReturnPostCaptionAction };
