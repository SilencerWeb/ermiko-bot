const { Post } = require('../models');
const { bot } = require('../bot');


const setUpRemovePostCaptionAction = () => {
  bot.action(/remove_post_caption_(.+)/, (context) => {
    const id = context.match[1];

    // We just need here an empty function so method findByIdAndUpdate would be executed
    Post.findByIdAndUpdate(id, { title: '' }, () => ({}));
  });
};


module.exports = { setUpRemovePostCaptionAction };
