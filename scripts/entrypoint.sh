#!/bin/bash
# SIGTERM handler
handler() {
  if [ $pid -ne 0 ]; then # 0 is the docker entrypoint
    # tell the node process to gracefully shut down
    kill -SIGTERM "$pid"

    # wait for it to die
    wait "$pid"
  fi
  exit 143 # 128 + 15 = SIGTERM
}

# setup callback handler
trap 'kill ${!}; handler' SIGTERM

if [ "$NODE_ENV" = "production" ]; then
  echo "Running in production mode..."
  ./node_modules/.bin/ts-node src/index.ts &
elif [ "$NODE_ENV" = "development" ]; then
  echo "Running in development mode..."
  ./node_modules/.bin/nodemon --inspect=9222 --exec ./node_modules/.bin/ts-node src/index.ts &
fi

pid="$!" # get the PID from the last output (started process)
echo "Process $pid spawned"

# wait forever
while true
do
  tail -f /dev/null & wait ${!}
done
