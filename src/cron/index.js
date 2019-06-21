const { registerFetchingNewPostsCronJob } = require('./register-fetching-new-posts-cron-job');
const { registerDeletingDismissedPostsCronJob } = require('./register-deleting-dismissed-posts-cron-job');
const { registerPublishingPostsCronJob } = require('./register-publishing-posts-cron-job');


module.exports = {
  registerFetchingNewPostsCronJob,
  registerDeletingDismissedPostsCronJob,
  registerPublishingPostsCronJob,
};
