#!/bin/sh

zip -r tester.package.zip . \
  -x node_modules/\*\
  -x documentation/\*\
  -x .git/\*\
  -x examples/\*\
  -x *test\*\
  -x ".gitignore"\
  -x *test/\*\
  -x "createPackage.sh"
