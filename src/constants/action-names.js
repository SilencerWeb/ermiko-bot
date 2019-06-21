const ACTION_NAMES = {
  approve_post: {
    regexp: /approve_post_(.+)/,
    string: 'approve_post',
  },
  dismiss_post: {
    regexp: /dismiss_post_(.+)/,
    string: 'dismiss_post',
  },
  approve_post_confirmation: {
    regexp: /approve_post_confirmation_(.+)/,
    string: 'approve_post_confirmation',
  },
  dismiss_post_confirmation: {
    regexp: /dismiss_post_confirmation_(.+)/,
    string: 'dismiss_post_confirmation',
  },
  approve_post_rejection: {
    regexp: /approve_post_rejection_(.+)/,
    string: 'approve_post_rejection',
  },
  dismiss_post_rejection: {
    regexp: /dismiss_post_rejection_(.+)/,
    string: 'dismiss_post_rejection',
  },
  remove_post_caption: {
    regexp: /remove_post_caption_(.+)/,
    string: 'remove_post_caption',
  },
  return_post_caption: {
    regexp: /return_post_caption_(.+)/,
    string: 'return_post_caption',
  },
};


module.exports = { ACTION_NAMES };
