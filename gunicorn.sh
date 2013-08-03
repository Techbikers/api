#!/bin/bash
  set -e
  ROOT=/home/django/webapps/techbikers.com
  NEW_RELIC_CONFIG_FILE=$ROOT/newrelic.ini
  export NEW_RELIC_CONFIG_FILE
  LOGFILE=$ROOT/log/gunicorn.log
  LOGDIR=$(dirname $LOGFILE)
  NUM_WORKERS=3
  # user/group to run as
  USER=django
  GROUP=django
  cd $ROOT
  test -d $LOGDIR || mkdir -p $LOGDIR
  newrelic-admin run-program gunicorn_django -w $NUM_WORKERS \
    --user=$USER --group=$GROUP --log-level=debug \
    --log-file=$LOGFILE 2>>$LOGFILE
