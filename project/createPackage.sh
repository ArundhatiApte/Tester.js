#!/bin/sh

rm tester.package.tar.gz

tar -czvf tester.package.tar.gz \
  --exclude='test*'\
  --exclude='tests.js'\
  ./../LICENCE package.json ./../README.md src
