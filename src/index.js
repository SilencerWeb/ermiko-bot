require('dotenv').config();
const Telegraf = require('telegraf');
const { setUpDatabase } = require('./lib');
const { registerFetchingNewPostsCronJob } = require('./cron');
const { setUpApprovePostAction, setUpDismissPostAction, setUpRemovePostCaptionAction } = require('./actions');
const { bot } = require('./bot');


// Setting up database
setUpDatabase();

// Registering cron jobs
registerFetchingNewPostsCronJob();

// Setting up sessions
bot.use(Telegraf.session());

// Setting up actions
setUpApprovePostAction();
setUpDismissPostAction();
setUpRemovePostCaptionAction();

// Starting bot
bot.startPolling();
console.log('Bot is up and running');
