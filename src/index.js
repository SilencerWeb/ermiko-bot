require('dotenv').config();
const { setUpDatabase } = require('./lib');
const { registerFetchingNewPostsCronJob, registerDeletingDismissedPostsCronJob } = require('./cron');
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


// Setting up database
setUpDatabase();

// Registering cron jobs
registerFetchingNewPostsCronJob();
registerDeletingDismissedPostsCronJob();

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
