#!/bin/bash
bun bundle
bun render
bun tailwind
rsync -a src/static/ www/ --exclude articles --exclude about --exclude styles
bun scripts/metadata.ts