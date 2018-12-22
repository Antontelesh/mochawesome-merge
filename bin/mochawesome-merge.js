#!/usr/bin/env node
const { merge } = require('../lib/index')

const { argv } = require('yargs').option('reportDir')

merge(argv).then(
  report => {
    process.stdout.write(JSON.stringify(report, null, 2))
  },
  error => {
    console.error('ERROR: Failed to merge reports\n')
    console.error(error)
    process.exit(1)
  }
)
