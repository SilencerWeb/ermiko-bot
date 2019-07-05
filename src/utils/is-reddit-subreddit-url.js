const redditSubredditUrlRegexp = /http(s)?:\/\/(www.)?reddit.com\/r\//;

const isRedditSubredditURL = (string) => {
  return redditSubredditUrlRegexp.test(string);
};


module.exports = { isRedditSubredditURL };
