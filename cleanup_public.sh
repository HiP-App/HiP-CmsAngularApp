#!/bin/bash

# 1. Cleanup root directory

# 1a. Save necessary files from root directory in tmp
mkdir tmp
mv bundle.min.js favicon.ico hip-config.json hip-theme.css index.html tmp/

# 1b. Delete all files in the root directory (except .sh files)
find . -maxdepth 1 -type f ! -name '*.sh' -delete
rm -rf ./.gitignore ./.git/ ./.jshintignore

# 1c. Move saved files back from tmp to root directory
mv tmp/* ./

# 2. Cleanup node_modules directory

# 2a. Save the necessary files from node_modules in tmp2
mkdir tmp2

mkdir tmp2/angular2-toaster
mv node_modules/angular2-toaster/toaster.css tmp2/angular2-toaster/

mkdir tmp2/core-js
mkdir tmp2/core-js/client
mv node_modules/core-js/client/shim.min.js tmp2/core-js/client/

mkdir tmp2/reflect-metadata
mv node_modules/reflect-metadata/Reflect.js tmp2/reflect-metadata/

mkdir tmp2/systemjs
mkdir tmp2/systemjs/dist
mv node_modules/systemjs/dist/system.src.js tmp2/systemjs/dist/

mkdir tmp2/zone.js
mkdir tmp2/zone.js/dist
mv node_modules/zone.js/dist/zone.js tmp2/zone.js/dist/

# 2b. Delete node_modules directory
rm -rf node_modules

# 2c. Create node_modules directory with files from tmp2
mkdir node_modules
mv tmp2/* node_modules

# 3. Delete unused directories
rm -rf _test-output app dist docs tmp tmp2 typings
