#!/bin/bash

# set subdirectory as base
if [ $# == 1 ]
then sed -i "s/<base href=\"\/\">/<base href=\"\/$1\/\">/g" index.html
fi

# replace systemjs config with bundle
sed -i 's/<script src="systemjs.config.js"><\/script>/<script src="bundle.min.js"><\/script>/g' index.html

# remove the dynamic load of modules
sed -zi "s/  <script>\n    System.import('app').catch(function (err) {\n      console.error(err);\n    });\n  <\/script>/ /g" index.html

mv dist/bundle.min.js bundle.min.js
