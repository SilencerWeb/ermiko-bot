const Markup = require('telegraf/markup');
const { ACTION_NAMES } = require('../constants');


const generatePostKeyboard = (id, removeCaption) => Markup.inlineKeyboard([
  [
    removeCaption ?
      Markup.callbackButton('🖍 Remove caption', `${ACTION_NAMES.remove_post_caption.string}_${id}`)
      :
      Markup.callbackButton('✏️ Return caption', `${ACTION_NAMES.return_post_caption.string}_${id}`),
  ],
  [
    Markup.callbackButton('✅ Approve', `${ACTION_NAMES.approve_post.string}_${id}`),
    Markup.callbackButton('❌ Dismiss', `${ACTION_NAMES.dismiss_post.string}_${id}`),
  ],
]);


module.exports = { generatePostKeyboard };
