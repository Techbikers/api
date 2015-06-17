#!/bin/bash
  set -e
  ROOT=~/techbikers.com/releases/current
  NEW_RELIC_CONFIG_FILE=$ROOT/newrelic.ini
  export NEW_RELIC_CONFIG_FILE
  LOGFILE=$ROOT/log/gunicorn.log
  LOGDIR=$(dirname $LOGFILE)
  NUM_WORKERS=3
  # user/group to run as
  USER=django
  GROUP=django
  cd $ROOT
  source ../../bin/activate
  test -d $LOGDIR || mkdir -p $LOGDIR
  newrelic-admin run-program gunicorn server.wsgi\
    --workers $NUM_WORKERS \
    --user=$USER \
    --group=$GROUP \
    --log-level=debug \
    --log-file=$LOGFILE 2>>$LOGFILE
