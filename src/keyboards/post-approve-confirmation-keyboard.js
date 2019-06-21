const Markup = require('telegraf/markup');
const { ACTION_NAMES } = require('../constants');


const generatePostApproveConfirmationKeyboard = (id) => Markup.inlineKeyboard([
  [Markup.callbackButton('✅ Yes, approve this post', `${ACTION_NAMES.approve_post_confirmation.string}_${id}`)],
  [Markup.callbackButton(`◀️ Go back`, `${ACTION_NAMES.approve_post_rejection.string}_${id}`)],
]);


module.exports = { generatePostApproveConfirmationKeyboard };
