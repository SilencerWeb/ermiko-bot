import { sendPost } from './functions';
import { CHANNELS_INFO } from '../constants/constants';


export const sendPostToModerationGroup = (post, channel) => {
  const channelInfo = CHANNELS_INFO[channel];
  const channelModerationGroup = channelInfo.moderationGroup;

  sendPost(post, channelModerationGroup);
};
