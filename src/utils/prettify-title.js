const prettifyTitle = (title) => {
  return title
    .replace(/\.+$/, '') // Removes dots in the end of the string
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
};


module.exports = { prettifyTitle };
