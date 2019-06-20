const Telegraf = require('telegraf');
const { BOT_TOKEN } = require('./constants');


const bot = new Telegraf(BOT_TOKEN);


module.exports = { bot };
