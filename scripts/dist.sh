#!/bin/bash
GREY="\033[30m"
RESET="\033[0m"
function say_and_do {
    echo -e "$GREY>$1$RESET"
    sh -c "$1"
}

say_and_do "bun bundle"
say_and_do "bun scripts/render/render.ts"
say_and_do "bun styles"
say_and_do "cp src/static www/static"