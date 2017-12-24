var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});



exports.report = function(reportTo, reportText) {
  var params = {
    screen_name: reportTo,
    text: reportText
  };

  client.post('direct_messages/new', params, function(error, message, response) {
    if (!error) {
      console.log(message);
    } else {
      console.log(error);
    }
  });

};