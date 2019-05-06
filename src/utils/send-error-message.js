import { bot } from '../bot';
import { ERRORS_REPORT_CHANNEL_ID } from '../constants';


export const sendErrorMessage = (errorMessage) => {
  bot.sendMessage(ERRORS_REPORT_CHANNEL_ID, errorMessage);
};
