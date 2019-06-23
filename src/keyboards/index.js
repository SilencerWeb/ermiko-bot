const { generatePostKeyboard } = require('./post-keyboard');
const { generatePostApproveConfirmationKeyboard } = require('./post-approve-confirmation-keyboard');
const { generatePostDismissConfirmationKeyboard } = require('./post-dismiss-confirmation-keyboard');
const { generateApprovedPostKeyboard } = require('./approved-post-keyboard');
const { generateDismissedPostKeyboard } = require('./dismissed-post-keyboard');
const { generateUndoPostModerationConfirmationKeyboard } = require('./undo-post-moderation-confirmation');
const { generatePublishedPostKeyboard } = require('./published-post-keyboard');


module.exports = {
  generatePostKeyboard,
  generatePostApproveConfirmationKeyboard,
  generatePostDismissConfirmationKeyboard,
  generateApprovedPostKeyboard,
  generateDismissedPostKeyboard,
  generateUndoPostModerationConfirmationKeyboard,
  generatePublishedPostKeyboard,
};
