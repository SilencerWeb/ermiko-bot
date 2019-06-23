const { CHANNELS } = require('../constants');


const getChannel = (channelName) => {
  return CHANNELS.find((channel) => channel.name === channelName) || null;
};


module.exports = { getChannel };
