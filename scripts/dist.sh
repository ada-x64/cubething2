#!/bin/bash
GREY="\033[30m"
RESET="\033[0m"
function say_and_do {
    echo -e "$GREY>$1$RESET"
    sh -c "$1"
}

say_and_do "bun bundle"
say_and_do "bun render"
say_and_do "bun sass"
say_and_do "bun tailwind"
say_and_do "rsync -av src/static/ www/ --exclude markup --exclude styles"
say_and_do "bun scripts/metadata.ts"