import cron from 'cron';
import { generateJSON, sendPost } from './functions';


const cronSendingPostsPatterns = [
  '0 15 * * * *',
  '0 30 * * * *',
  '0 45 * * * *',
];

export const startCron = () => {
  cronSendingPostsPatterns.forEach((cronPattern) => {
    new cron.CronJob(cronPattern, () => {
      sendPost('AwwSoCute');
      sendPost('InterestingAsFuckk');
    }, null, true);
  });

  new cron.CronJob('0 0 0 * * *', () => {
    generateJSON('AwwSoCute');
    generateJSON('InterestingAsFuckk');
  }, null, true);
};
