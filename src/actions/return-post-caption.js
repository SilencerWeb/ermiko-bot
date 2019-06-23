const { generatePostKeyboard } = require('../keyboards');
const { getChannel } = require('../utils');
const { Post } = require('../models');
const { bot } = require('../bot');
const { ACTION_NAMES, IS_PRODUCTION, DEVELOPMENT_GROUP_ID } = require('../constants');


const setUpReturnPostCaptionAction = () => {
  bot.action(ACTION_NAMES.return_post_caption.regexp, (context) => {
    const id = context.match[1];
    const callbackQueryId = context.update.callback_query.id;

    Post.findByIdAndUpdate(id, { isCaptionVisible: true }, async (error) => {
      if (error) {
        console.log(`Error on changing post's "isCaptionVisible" with ID ${id} to "true"`);
        console.log(`Error message: ${error.message}`);
        context.telegram.answerCbQuery(callbackQueryId, `Couldn't return caption. Error: ${error.message}`);
      } else {
        const post = await Post.findById(id);

        const title = post.title;

        const channel = getChannel(post.channelName);
        const moderationGroupId = IS_PRODUCTION ? channel.moderationGroupId : DEVELOPMENT_GROUP_ID;
        const moderationGroupMessageId = post.moderationGroupMessageId;
        const keyboard = generatePostKeyboard(id, true);

        context.telegram.editMessageCaption(moderationGroupId, moderationGroupMessageId, '', title, { reply_markup: keyboard });
        context.telegram.answerCbQuery(callbackQueryId, 'Caption was successfully returned');
      }
    });
  });
};


module.exports = { setUpReturnPostCaptionAction };
