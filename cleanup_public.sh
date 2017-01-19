#!/bin/bash

# remove unused folders
rm -rf app dist typings

mkdir tmp
mv hip-theme.css index.html bundle.min.js hip-config.json favicon.ico package.json tmp/

#cleanup files
find . -maxdepth 1 -type f ! -name '*.sh' -delete
rm -rf ./.gitignore ./.git/ ./.jshintignore

mv tmp/* ./
rm -rf tmp