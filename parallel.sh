#!/bin/bash

denon develop_frontend &
denon develop_backend &

# Wait for any process to exit
wait -n
  
# Exit with status of process that exited first
exit $?