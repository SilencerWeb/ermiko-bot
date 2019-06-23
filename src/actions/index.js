const { setUpApprovePostAction } = require('./approve-post');
const { setUpDismissPostAction } = require('./dismiss-post');
const { setUpApprovePostConfirmationAction } = require('./approve-post-confirmation');
const { setUpDismissPostConfirmationAction } = require('./dismiss-post-confirmation');
const { setUpApprovePostRejectionAction } = require('./approve-post-rejection');
const { setUpDismissPostRejectionAction } = require('./dismiss-post-rejection');
const { setUpApprovedPostAction } = require('./approved-post');
const { setUpDismissedPostAction } = require('./dismissed-post');
const { setUpUndoPostModerationConfirmationAction } = require('./undo-post-moderation-confirmation');
const { setUpUndoPostModerationRejectionAction } = require('./undo-post-moderation-rejection');
const { setUpRemovePostCaptionAction } = require('./remove-post-caption');
const { setUpReturnPostCaptionAction } = require('./return-post-caption');


module.exports = {
  setUpApprovePostAction,
  setUpDismissPostAction,
  setUpApprovePostConfirmationAction,
  setUpDismissPostConfirmationAction,
  setUpApprovePostRejectionAction,
  setUpDismissPostRejectionAction,
  setUpApprovedPostAction,
  setUpDismissedPostAction,
  setUpUndoPostModerationConfirmationAction,
  setUpUndoPostModerationRejectionAction,
  setUpRemovePostCaptionAction,
  setUpReturnPostCaptionAction,
};
