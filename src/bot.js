import Telegram from 'telegraf/telegram';
import { BOT_TOKEN } from './constants';


export const bot = new Telegram(BOT_TOKEN);
