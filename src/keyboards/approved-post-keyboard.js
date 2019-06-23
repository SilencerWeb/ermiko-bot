const Markup = require('telegraf/markup');
const { ACTION_NAMES } = require('../constants');


const generateApprovedPostKeyboard = (id) => Markup.inlineKeyboard([
  [Markup.callbackButton('✅ Approved', `${ACTION_NAMES.approved_post.string}_${id}`)],
]);


module.exports = { generateApprovedPostKeyboard };
