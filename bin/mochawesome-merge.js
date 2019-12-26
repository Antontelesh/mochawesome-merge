#!/usr/bin/env node

const { merge } = require('../lib/index')

merge({ files: process.argv.slice(2) }).then(
  report => {
    process.stdout.write(JSON.stringify(report, null, 2))
  },
  error => {
    console.error('ERROR: Failed to merge reports\n')
    console.error(error)
    process.exit(1)
  }
)
