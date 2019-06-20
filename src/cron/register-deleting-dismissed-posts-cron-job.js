const CronJob = require('cron').CronJob;
const { Post } = require('../models');


const registerDeletingDismissedPostsCronJob = () => {

  new CronJob('* * * * * 0', () => { // Every Sunday
    Post.deleteMany({ status: 'dismissed' }, (error) => {
      if (error) {
        console.log('Error on deleting dismissed posts!');
        console.log(`Error message: ${error.message}`);
      }
    });
  }, null, true);
};


module.exports = { registerDeletingDismissedPostsCronJob };
