const { Post } = require('../models');
const { bot } = require('../bot');


const setUpApprovePostAction = () => {
  bot.action(/approve_post_(.+)/, (context) => {
    const id = context.match[1];

    // We just need here an empty function so method findByIdAndUpdate would be executed
    Post.findByIdAndUpdate(id, { status: 'approved' }, (error) => {
      if (error) {
        console.log(`Error on changing post's status with ID ${id} to "approved"!`);
        console.log(`Error message: ${error.message}`);
      } else {
        console.log(`Post's status with ID ${id} is successfully changed to "approved"!`);
      }
    });
  });
};


module.exports = { setUpApprovePostAction };
