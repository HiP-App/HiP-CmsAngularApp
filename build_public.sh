#!/bin/bash

# replace systemjs config with bundle
sed -i 's/<script src="systemjs.config.js"><\/script>/<script src="bundle.min.js"><\/script>/g' index.html

# remove the dynamic load of modules
sed -zi "s/  <script>\n    System.import('app').catch(function (err) {\n      console.error(err);\n    });\n  <\/script>/ /g" index.html

# build bundle
npm run build_prod

mv dist/bundle.min.js bundle.min.js

# remove unused folders
rm -rf app dist typings


mkdir tmp
mv hip-theme.css index.html bundle.min.js hip-config.json favicon.ico package.json tmp/

#cleanup files
find . -maxdepth 1 -type f ! -name '*.sh' -delete
rm -rf ./.gitignore ./.git/ ./.jshintignore

mv tmp/* ./
rm -rf tmp