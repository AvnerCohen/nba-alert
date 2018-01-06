# NBA Alerts

Get alerts on close NBA games of your favorite teams.

What is A close game is configurable (default is 5 points diff as of minute 40:00)


```
  Usage: nba_alert [options]


  Options:

    -r, --reporter <str>  Twitter / Slack / Mobile Notifications [default: twitter]
    -m, --minute <n>      Minute in the game to alert from [default:  40]
    -d, --diff <n>        Alert when score diff is less then [default: 5]
    -t, --teams <items>   Teams you follow [default: OKC,TOR]
    -u, --username <str>  User name for Notificiation
    -h, --help            output usage information
```


## Reporters / Notification

#### Twitter
If running the twitter report, make sure to add the relevant keys when running the process:

* `TWITTER_CONSUMER_KEY`
* `TWITTER_CONSUMER_SECRET`
* `TWITTER_ACCESS_TOKEN_KEY`
* `TWITTER_ACCESS_TOKEN_SECRET`

One option here is creating a dummy twitter user, follow it and back, and use the reporter will DM from that user into your account.


#### Pushover
https://pushover.net application, Relevant keys when running the process:

* `PUSHOVER_USER`
* `PUSHOVER_TOKEN`

#### Pushjet
https://pushjet.io/ application, environment variables when running the process:

* `PUSHJET_SECRET`


## Command
````
yarn add nba-alert
nohup ./node_modules/.bin/nba_alert >> ./log/nba-alert.log &
````

## License
MIT