require('dotenv').config();
const { startServer } = require('./server');
const { setUpDatabase } = require('./database');
const { registerFetchingNewPostsCronJob, registerPublishingPostsCronJob } = require('./cron');
const { setUpStartCommand, setUpStatsCommand } = require('./commands');
const { setUpNewTextMessageMiddleware } = require('./middlewares');
const {
  setUpApprovePostAction,
  setUpDismissPostAction,
  setUpApprovePostConfirmationAction,
  setUpDismissPostConfirmationAction,
  setUpApprovePostRejectionAction,
  setUpDismissPostRejectionAction,
  setUpApprovedPostAction,
  setUpDismissedPostAction,
  setUpUndoPostModerationConfirmationAction,
  setUpUndoPostModerationRejectionAction,
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

// Setting up commands
setUpStartCommand();
setUpStatsCommand();

// Setting up middlewares
setUpNewTextMessageMiddleware();

// Setting up actions
// Order matters because of regexps!
setUpApprovePostConfirmationAction();
setUpDismissPostConfirmationAction();
setUpApprovePostRejectionAction();
setUpDismissPostRejectionAction();
setUpApprovePostAction();
setUpDismissPostAction();
setUpApprovedPostAction();
setUpDismissedPostAction();
setUpUndoPostModerationConfirmationAction();
setUpUndoPostModerationRejectionAction();
setUpRemovePostCaptionAction();
setUpReturnPostCaptionAction();

// Starting bot
bot.launch()
  .then(() => {
    console.log('Bot is up and running');
  })
  .catch((error) => {
    console.log('Error on starting the bot');
    console.log(`Error message: ${error.message}`);
  });
