const uuid = require('uuid')
const fse = require('fs-extra')
const minimatch = require('minimatch')
const path = require('path')
const { pipe, flatMap } = require('./utils')

const collectDuration = xs => xs.reduce((acc, x) => acc + x.duration, 0)

const Suite = ({ root, tests = [], suites, ...rest }) => {
  const duration = collectDuration(tests) + collectDuration(suites)

  return {
    uuid: uuid.v4(),
    tests,
    suites,
    duration,
    root,
    rootEmpty: root && tests.length === 0,
    title: '',
    fullFile: '',
    file: '',
    beforeHooks: [],
    afterHooks: [],
    passes: [],
    failures: [],
    pending: [],
    skipped: [],
    _timeout: 2000,
    ...rest,
  }
}

function Stats({ suites }) {
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

const Report = suites => ({
  stats: Stats(suites),
  suites,
  copyrightYear: new Date().getFullYear(),
})

async function collectReportFiles(dir) {
  const files = await fse.readdir(dir).catch(() => {
    throw new Error(`Directory ${dir} does not exist`)
  })
  return Promise.all(
    files
      .filter(file => minimatch(file, 'mochawesome*.json'))
      .map(filename => path.resolve(dir, filename))
      .map(filename => fse.readJson(filename))
  )
}

const collectReportSuites = pipe(flatMap(report => report.suites.suites))

const getAllTests = flatMap(suite => [
  ...suite.tests,
  ...getAllTests(suite.suites),
])

exports.merge = function merge({ reportDir = 'mochawesome-report' } = {}) {
  return Promise.resolve(path.resolve(process.cwd(), reportDir))
    .then(collectReportFiles)
    .then(collectReportSuites)
    .then(suites => Suite({ root: true, suites }))
    .then(Report)
}
