const Markup = require('telegraf/markup');
const { ACTION_NAMES } = require('../constants');


const generateUndoPostModerationConfirmationKeyboard = (id) => Markup.inlineKeyboard([
  [Markup.callbackButton('🕐 Yes, undo this post moderation', `${ACTION_NAMES.undo_post_moderation_confirmation.string}_${id}`)],
  [Markup.callbackButton(`◀️ Go back`, `${ACTION_NAMES.undo_post_moderation_rejection.string}_${id}`)],
]);


module.exports = { generateUndoPostModerationConfirmationKeyboard };
