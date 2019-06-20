const { Post } = require('../models');
const { bot } = require('../bot');


const setUpDismissPostAction = () => {
  bot.action(/dismiss_post_(.+)/, (context) => {
    const id = context.match[1];

    // We just need here an empty function so method findByIdAndUpdate would be executed
    Post.findByIdAndUpdate(id, { status: 'dismissed' }, (error) => {
      if (error) {
        console.log(`Error on changing post's "status" with ID ${id} to "dismissed"!`);
        console.log(`Error message: ${error.message}`);
      }
    });
  });
};


module.exports = { setUpDismissPostAction };
