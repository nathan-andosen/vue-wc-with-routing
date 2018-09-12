#!/bin/bash

env NODE_ENV=prod rollup -c ./config/rollup.config.js

npm run compile-scss