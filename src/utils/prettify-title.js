const prettifyTitle = (title) => {
  return title
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
};


module.exports = { prettifyTitle };
