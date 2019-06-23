const getMessageLink = (chatId, messageId) => {
  chatId = chatId.toString();
  chatId = chatId.includes('-100') ? chatId.slice(4) : chatId;

  return `t.me/c/${chatId}/${messageId}`;
};


module.exports = { getMessageLink };
