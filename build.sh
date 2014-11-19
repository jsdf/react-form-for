#!/bin/bash
JSX=`npm root`/.bin/jsx
PRAGMA="/** @jsx React.DOM */"

for f in src/*.js
do
  cat $f | (echo "$PRAGMA" && cat) | $JSX --harmony > lib/`basename $f`
done
