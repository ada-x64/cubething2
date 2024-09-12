#!/bin/bash
GREY="\033[30m"
RESET="\033[0m"
function say_and_do {
    echo -e "$GREY>$1$RESET"
    sh -c "$1"
}
if [ -n '$PROD' ]; then PROD='false'; fi
say_and_do 'bunx sass -w --source-map --embed-source-map --quiet-deps -s compressed src/styles/:www/styles | tee sass.log &'
say_and_do "bun build --watch src/client/app.ts --outdir www/js --sourcemap=inline --minify --define 'BUILD_INFO={\"PROD\": \"$PROD\", \"HOT\": \"true\"}' | tee bundle.log &"
say_and_do 'bun --hot ./src/server/index.ts | tee server.log &'
say_and_do 'bun scripts/watcher.ts'