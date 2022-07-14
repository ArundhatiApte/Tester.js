#!/bin/sh

rm tester.package.tar.gz

tar -czvf\
  tester.package.tar.gz \
  --transform='s,^,package/,'\
  --exclude='test*'\
  esExport.mjs\
  ./../LICENCE package.json ./../README.md src
