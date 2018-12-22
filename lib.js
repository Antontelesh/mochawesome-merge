const uuid = require('uuid')
const fse = require('fs-extra')
const minimatch = require('minimatch')
const path = require('path')
const { flatMap } = require('./utils')

async function collectReportFiles(dir) {
  const files = await fse.readdir(dir)
  return files
    .filter(file => minimatch(file, 'mochawesome*.json'))
    .map(filename => path.resolve(dir, filename))
    .map(require)
}

function collectReportSuites(reports) {
  return flatMap(report => report.suites.suites, reports)
}

function getAllTests(suites) {
  return flatMap(
    suite => [...suite.tests, ...getAllTests(suite.suites)],
    suites
  )
}

function generateStats(suites) {
  const tests = getAllTests(suites)
  const passes = tests.filter(test => test.pass)
  const pending = tests.filter(test => test.pending)
  const failures = tests.filter(test => test.fail)
  const skipped = tests.filter(test => test.skipped)
  return {
    suites: suites.length,
    tests: tests.length,
    passes: passes.length,
    pending: pending.length,
    failures: failures.length,
    start: new Date().toISOString(),
    end: new Date().toISOString(),
    duration: tests.map(test => test.duration).reduce((a, b) => a + b, 0),
    testsRegistered: tests.length,
    passPercent: (passes.length * 100) / tests.length,
    pendingPercent: (pending.length * 100) / tests.length,
    other: 0,
    hasOther: false,
    skipped: skipped.length,
    hasSkipped: !!skipped.length,
    passPercentClass: 'warning',
    pendingPercentClass: 'danger',
  }
}

function generateReport(suites) {
  return {
    stats: generateStats(suites),
    suites: {
      uuid: uuid(),
      title: '',
      fullFile: '',
      file: '',
      beforeHooks: [],
      afterHooks: [],
      tests: [],
      suites,
    },
  }
}

exports.merge = function merge({ reportDir = 'mochawesome-report' } = {}) {
  return collectReportFiles(reportDir)
    .then(collectReportSuites)
    .then(generateReport)
}
