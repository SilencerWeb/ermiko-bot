const { Post } = require('../models');
const { bot } = require('../bot');


const setUpApprovePostAction = () => {
  bot.action(/approve_post_(.+)/, (context) => {
    const id = context.match[1];

    // We just need here an empty function so method findByIdAndUpdate would be executed
    Post.findByIdAndUpdate(id, { status: 'approved' }, () => ({}));
  });
};


module.exports = { setUpApprovePostAction };
