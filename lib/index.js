const fse = require('fs-extra')
const glob = require('glob')
const { flatMap } = require('./utils')

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
  }
}

function collectReportFiles(reportsGlob) {
  const files = glob.sync(reportsGlob)

  if (files.length === 0) {
    throw new Error(`Pattern ${reportsGlob} matched no report files`)
  }

  return Promise.all(files.map(filename => fse.readJson(filename)))
}

const collectReportSuites = flatMap(report =>
  report.results.filter(r => r !== false)
)

const getAllTests = flatMap(suite => [
  ...suite.tests,
  ...getAllTests(suite.suites),
])

exports.merge = async function merge({
  reportsGlob = './mochawesome-report/mochawesome*.json',
} = {}) {
  const reports = await collectReportFiles(reportsGlob)
  const suites = collectReportSuites(reports)

  return {
    stats: generateStats(suites),
    results: suites,
    meta: reports[0].meta,
  }
}
