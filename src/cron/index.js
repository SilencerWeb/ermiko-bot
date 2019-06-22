const { registerFetchingNewPostsCronJob } = require('./register-fetching-new-posts-cron-job');
const { registerPublishingPostsCronJob } = require('./register-publishing-posts-cron-job');


module.exports = {
  registerFetchingNewPostsCronJob,
  registerPublishingPostsCronJob,
};
