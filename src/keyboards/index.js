const { generatePostKeyboard } = require('./post-keyboard');
const { generatePostApproveConfirmationKeyboard } = require('./post-approve-confirmation-keyboard');
const { generatePostDismissConfirmationKeyboard } = require('./post-dismiss-confirmation-keyboard');


module.exports = {
  generatePostKeyboard,
  generatePostApproveConfirmationKeyboard,
  generatePostDismissConfirmationKeyboard,
};
