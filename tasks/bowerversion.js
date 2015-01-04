#!/usr/bin/env node
spawn = require('child_process').spawn
exec = require('child_process').exec
fs = require('fs')

exec('git rev-parse --show-toplevel', function(err, stdout, stderr) {
  // set working directory to git repo root
  rootDir = stdout.split('\n')[0]
  process.chdir(rootDir)

  bowerJSON = JSON.parse(fs.readFileSync('./bower.json', {encoding: 'utf8'}))
  bowerJSON.version = JSON.parse(fs.readFileSync('./package.json', {encoding: 'utf8'})).version
  fs.writeFileSync('./bower.json', JSON.stringify(bowerJSON, null, 2)+'\n', {encoding: 'utf8'})
})
