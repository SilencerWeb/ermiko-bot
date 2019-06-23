const { generatePostKeyboard } = require('../keyboards');
const { getChannel } = require('../utils');
const { Post } = require('../models');
const { bot } = require('../bot');
const { ACTION_NAMES, IS_PRODUCTION, DEVELOPMENT_GROUP_ID } = require('../constants');


const setUpRemovePostCaptionAction = () => {
  bot.action(ACTION_NAMES.remove_post_caption.regexp, (context) => {
    const id = context.match[1];
    const callbackQueryId = context.update.callback_query.id;

    Post.findByIdAndUpdate(id, { isCaptionVisible: false }, async (error) => {
      if (error) {
        console.log(`Error on changing post's "isCaptionVisible" with ID ${id} to "false"`);
        console.log(`Error message: ${error.message}`);
        context.telegram.answerCbQuery(callbackQueryId, `Couldn't remove caption. Error: ${error.message}`);
      } else {
        const post = await Post.findById(id);

        const channel = getChannel(post.channelName);
        const moderationGroupId = IS_PRODUCTION ? channel.moderationGroupId : DEVELOPMENT_GROUP_ID;
        const moderationGroupMessageId = post.moderationGroupMessageId;
        const keyboard = generatePostKeyboard(id, false);

        context.telegram.editMessageCaption(moderationGroupId, moderationGroupMessageId, '', '', { reply_markup: keyboard });
        context.telegram.answerCbQuery(callbackQueryId, 'Caption was successfully removed');
      }
    });
  });
};


module.exports = { setUpRemovePostCaptionAction };
