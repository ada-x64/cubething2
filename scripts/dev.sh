#!/bin/bash
bun dist
bun --hot ./src/server/index.ts | tee server.log &
bun scripts/watcher.ts