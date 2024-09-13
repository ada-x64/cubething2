#!/bin/bash
GREY="\033[30m"
RESET="\033[0m"
function say_and_do {
    echo -e "$GREY>$1$RESET"
    sh -c "$1"
}
say_and_do "$(
cat <<EOF
    bun --hot ./src/server/index.ts \
    | tee server.log &
EOF
)"
say_and_do 'bun scripts/watcher.ts'