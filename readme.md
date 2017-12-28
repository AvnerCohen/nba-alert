# NBA Alerts

Can be used if you want, during non-playoff season, to get alerts on close games.

What is A close game is configurable (default is 5 points diff a of minute 40:00)


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


## Reporters

*Twitter*
If running the twitter report, make sure to add the relevant keys when running the process:
`TWITTER_CONSUMER_KEY`
`TWITTER_CONSUMER_SECRET`
`TWITTER_ACCESS_TOKEN_KEY`
`TWITTER_ACCESS_TOKEN_SECRET`

In my case, I basically created a dummy twitter user, followed it back, and the reporter will DM from there.


*Pushover*
https://pushover.net application.
relevant keys when running the process:
`PUSHOVER_USER`
`PUSHOVER_TOKEN`


### Ongoing execution
```sh
nohup node nba_alert.js >> ./log/nba-alert.log &
```


Enjoy.