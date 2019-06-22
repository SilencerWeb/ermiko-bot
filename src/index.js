require('dotenv').config();
const { startServer } = require('./server');
const { setUpDatabase } = require('./database');
const { registerFetchingNewPostsCronJob, registerPublishingPostsCronJob } = require('./cron');
const {
  setUpApprovePostAction,
  setUpDismissPostAction,
  setUpApprovePostConfirmationAction,
  setUpDismissPostConfirmationAction,
  setUpApprovePostRejectionAction,
  setUpDismissPostRejectionAction,
  setUpRemovePostCaptionAction,
  setUpReturnPostCaptionAction,
} = require('./actions');
const { bot } = require('./bot');


// Starting the server. Required by Heroku
startServer();

// Setting up database
setUpDatabase();

// Registering cron jobs
registerFetchingNewPostsCronJob();
registerPublishingPostsCronJob();

// Setting up actions
// Order matters because of regexps!
setUpApprovePostConfirmationAction();
setUpDismissPostConfirmationAction();
setUpApprovePostRejectionAction();
setUpDismissPostRejectionAction();
setUpApprovePostAction();
setUpDismissPostAction();
setUpRemovePostCaptionAction();
setUpReturnPostCaptionAction();

// Starting bot
bot.startPolling();
console.log('Bot is up and running');
