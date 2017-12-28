'use strict'

const fs = require('fs');
const request = require('request');
const program = require('commander');
const schedule = require('node-schedule');

const URL_CURRENT_GAMES = 'https://data.nba.com/data/5s/v2015/json/mobile_teams/nba/2017/scores/00_todays_scores.json';
const PBP_URL = 'http://data.nba.com/data/10s/json/cms/noseason/game/DATE/GID/pbp_all.json';

program
  .option('-r, --reporter <str>', 'Twitter / Pushover / Slack Notifications [default: twitter]')
  .option('-m, --minute <n>', 'Minute in the game to alert from [default:  40]', parseInt)
  .option('-d, --diff <n>', 'Alert when score diff is less then [default: 5]', parseInt)
  .option('-t, --teams <items>', 'Teams you follow [default: OKC,TOR]', list)
  .option('-u, --username <str>', 'Twitter User name for Notificiation')
  .parse(process.argv);

const REPORTER_CLASS = program.reporter || "twitter";
const reporter = require('./reporters/' + REPORTER_CLASS + ".js");
const ALERT_AFTER_MINUTE = program.minute || 40;
const DIFF_LESS_THAN = program.diff || 5;
const teams = program.teams || ['OKC', 'TOR', 'GSW'];

var I_FOLLOW = {};
for (var team in teams) {
  I_FOLLOW[teams[team].toUpperCase()] = true;
}

function performRequest () {
  request(URL_CURRENT_GAMES, function(error, response, body) {
    // Check if any of games played today are being followed:
    var data = JSON.parse(body);
    for (var game in data["gs"]["g"]) {

      if (I_FOLLOW[data["gs"]["g"][game]['v']['ta']] ||
        I_FOLLOW[data["gs"]["g"][game]['h']['ta']]) {
        doesScoreWorthWakingUp(data["gs"]["g"][game]);
      }
    }
  });
}


function list(val) {
  return val.split(',');
}


function doesScoreWorthWakingUp(gameData) {
  var gid = gameData['gid'];
  var pbp_url = PBP_URL.replace('GID', gameData['gid']).replace('DATE', gameData['gcode'].split("/")[0]);
  console.log("Checking play status at: " + pbp_url);
  request(pbp_url, function(error, response, body) {
    try {
      var shouldAlert = false;
      var fullData = JSON.parse(body);
      var data = fullData.sports_content.game.play;
      var teams = fullData.sports_content.game.game_url.split('/')[1];
      var visitor = teams.substr(0, 3);
      var home = teams.substr(3, 3);

      var event = data[Object.keys(data)[Object.keys(data).length - 1]];
      for (var item in Object.keys(data)) {
        var event = data[item];
        var visitorScore = parseInt(event.visitor_score, 10);
        var homeScore = parseInt(event.home_score, 10);
        if (event.clock === '' ) {
          var cur_minutes = (event.description == 'Start Period') ? 12 : 0;
        } else {
          var cur_minutes = event.clock.split(':')[0];
        }
        var minutes = 12 - parseInt(cur_minutes, 10);
        var time = ((parseInt(event.period) - 1) * 12) + minutes;
        var fileName = "./alerts_log/" + gid + ".alert";
        var alertSent = fs.existsSync(fileName);
        if (!alertSent && time > ALERT_AFTER_MINUTE &&
             Math.abs(visitorScore - homeScore) < DIFF_LESS_THAN) {
          shouldAlert = true;
          fs.closeSync(fs.openSync(fileName, 'w'));
        }
        var printData = "[" + time + "] " + visitor + ": " + visitorScore + " - ";
        printData += home + ": " + homeScore;
        if (shouldAlert) {
          var reportStr = "wakey-wakey! " + printData;
          reporter.report(program.username, reportStr);
          shouldAlert = false;
        }
      }
    } catch (e) {
      console.log("Failed for :" + gameData['gcode'] + " with:" + e);
    }
  });
}

schedule.scheduleJob('*/5 16-23 * * *', () => {
  performRequest();
});