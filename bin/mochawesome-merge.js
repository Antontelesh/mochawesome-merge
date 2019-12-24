#!/usr/bin/env node

const { merge } = require('../lib/index')

const { argv } = require('yargs').command(
  '$0 [reportsGlob]',
  'Merge several Mochawesome JSON reports',
  yargs =>
    yargs.positional('reportsGlob', {
      type: 'string',
      default: './mochawesome-report/mochawesome*.json',
      description: 'glob pattern for source mochawesome JSON reports.',
    })
)

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
