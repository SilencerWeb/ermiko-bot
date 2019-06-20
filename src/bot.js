const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');
const { Post } = require('./models');
const { BOT_TOKEN } = require('./constants');


const telegrafBot = new Telegraf(BOT_TOKEN);

telegrafBot.action(/remove_post_caption_(.+)/, (context) => {
  const id = context.match[1];

  // We just need here an empty function so method findByIdAndUpdate would be executed
  Post.findByIdAndUpdate(id, { title: '' }, () => ({}));
});

telegrafBot.action(/approve_post_(.+)/, (context) => {
  const id = context.match[1];

  // We just need here an empty function so method findByIdAndUpdate would be executed
  Post.findByIdAndUpdate(id, { status: 'approved' }, () => ({}));
});

telegrafBot.action(/dismiss_post_(.+)/, (context) => {
  const id = context.match[1];

  // We just need here an empty function so method findByIdAndUpdate would be executed
  Post.findByIdAndUpdate(id, { status: 'dismissed' }, () => ({}));
});

telegrafBot.launch();


const telegramBot = new Telegram(BOT_TOKEN);


module.exports = { telegrafBot, telegramBot };
