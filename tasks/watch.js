#!/usr/bin/env node
spawn = require('child_process').spawn
exec = require('child_process').exec
chokidar = require('chokidar')

command = process.argv[2]
pathsToWatch = process.argv.slice(3)
bellOnError = process.argv.indexOf('--bell') < -1

runningCommand = false

exec('git rev-parse --show-toplevel', function(err, stdout, stderr) {
  // set working directory to git repo root
  rootDir = stdout.split('\n')[0]
  process.chdir(rootDir)

  console.log('watching', pathsToWatch.join(' '))
  chokidar.watch(pathsToWatch, {ignored: /[\/\\]\./, persistent: true})
    .on('change', function(path, stats) {
      console.log('change', path)
      if (runningCommand) return

      console.log('running npm run '+command)
      runningCommand = true
      spawn('npm', ['run', command], {stdio: 'inherit'})
        .on('exit', function(code) {
          if (code != 0) bell()
          runningCommand = false
        })
        .on('error', function(err) {
          runningCommand = false
          bell()
          console.error(err)
        })
    })
})

function bell() {
  if (bellOnError) process.stdout.write('\x07')
}
