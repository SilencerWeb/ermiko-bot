const Markup = require('telegraf/markup');
const { ACTION_NAMES } = require('../constants');


const generatePostDismissConfirmationKeyboard = (id) => Markup.inlineKeyboard([
  [Markup.callbackButton('❌ Yes, dismiss this post', `${ACTION_NAMES.dismiss_post_confirmation.string}_${id}`)],
  [Markup.callbackButton(`◀️ Go back`, `${ACTION_NAMES.dismiss_post_rejection.string}_${id}`)],
]);


module.exports = { generatePostDismissConfirmationKeyboard };
