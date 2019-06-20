const { Post } = require('../models');
const { bot } = require('../bot');


const setUpDismissPostAction = () => {
  bot.action(/dismiss_post_(.+)/, (context) => {
    const id = context.match[1];

    // We just need here an empty function so method findByIdAndUpdate would be executed
    Post.findByIdAndUpdate(id, { status: 'dismissed' }, () => ({}));
  });
};


module.exports = { setUpDismissPostAction };
