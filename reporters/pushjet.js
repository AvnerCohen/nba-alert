var request = require('request');

exports.report = function(reportTo, reportText) {
  var params = {
    message: reportText,
    secret: process.env.PUSHJET_SECRET
  };

  request.post('https://api.pushjet.io/message', {form: params},
               function(error, response, body) {
                 console.log(body);
               });
};