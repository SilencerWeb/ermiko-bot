const { IS_PRODUCTION } = require('./is-production');


const BOT_TOKEN = IS_PRODUCTION ? process.env.BOT_TOKEN_PRODUCTION : process.env.BOT_TOKEN_DEVELOPMENT;


module.exports = { BOT_TOKEN };
