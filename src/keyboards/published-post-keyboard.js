const Markup = require('telegraf/markup');


const generatePublishedPostKeyboard = (url) => Markup.inlineKeyboard([
  [Markup.urlButton('💌 Published', url)],
]);


module.exports = { generatePublishedPostKeyboard };
