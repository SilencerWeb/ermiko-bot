const { setUpApprovePostAction } = require('./approve-post');
const { setUpDismissPostAction } = require('./dismiss-post');
const { setUpApprovePostConfirmationAction } = require('./approve-post-confirmation');
const { setUpDismissPostConfirmationAction } = require('./dismiss-post-confirmation');
const { setUpApprovePostRejectionAction } = require('./approve-post-rejection');
const { setUpDismissPostRejectionAction } = require('./dismiss-post-rejection');
const { setUpRemovePostCaptionAction } = require('./remove-post-caption');
const { setUpReturnPostCaptionAction } = require('./return-post-caption');


module.exports = {
  setUpApprovePostAction,
  setUpDismissPostAction,
  setUpApprovePostConfirmationAction,
  setUpDismissPostConfirmationAction,
  setUpApprovePostRejectionAction,
  setUpDismissPostRejectionAction,
  setUpRemovePostCaptionAction,
  setUpReturnPostCaptionAction,
};
