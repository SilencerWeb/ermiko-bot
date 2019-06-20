require('dotenv').config();
const { setUpDatabase, registerCronJob } = require('./lib');


setUpDatabase();
registerCronJob();
