const Markup = require('telegraf/markup');
const { ACTION_NAMES } = require('../constants');


const generateDismissedPostKeyboard = (id) => Markup.inlineKeyboard([
  [Markup.callbackButton('❌ Dismissed', `${ACTION_NAMES.dismissed_post.string}_${id}`)],
]);


module.exports = { generateDismissedPostKeyboard };
