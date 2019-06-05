import { setUpDatabase } from './functions/set-up-database';
import { registerCronJob } from './functions/register-cron-job';


setUpDatabase();
registerCronJob();
