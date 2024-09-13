#!/bin/bash

GREY="\033[30m"
RESET="\033[0m"
function say_and_do {
    echo -e "$GREY>$1$RESET"
    sh -c "$1"
}
say_and_do "$(
cat <<EOF
bun build src/client/app.ts \
--outdir www/js \
--sourcemap=inline \
--minify \
--define \
'BUILD_INFO={\
"PROD": "$NODE_ENV", \
"HOT": "$HOT"\
}'
EOF
)"