var push = require('pushover-notifications');

var client = new push({user: process.env.PUSHOVER_USER,
                   token: process.env.PUSHOVER_TOKEN});

exports.report = function(reportTo, reportText) {
  var msg = {
    title: 'NBA Alert',
    message: reportText
  };

  client.send(msg, function(error, message) {
    if (!error) {
      console.log(message);
    } else {
      console.log(error);
    }
  });

};