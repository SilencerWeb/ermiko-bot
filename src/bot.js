import Telegraf from 'telegraf';
import Telegram from 'telegraf/telegram';
import { Post } from './models/models';
import { BOT_TOKEN } from './constants/constants';


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


export { telegrafBot, telegramBot };
