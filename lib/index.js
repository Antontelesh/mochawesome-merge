const fse = require('fs-extra')
const glob = require('glob')
const { flatMap } = require('./utils')

function resolveOptions({ files = [] } = {}) {
  return {
    files: files.length ? files : ['./mochawesome-report/mochawesome*.json'],
  }
}

const collectSourceFiles = flatMap(pattern => {
  const files = glob.sync(pattern).sort((a, b) => a.localeCompare(b, 'en'))
  if (!files.length) {
    throw new Error(`Pattern ${pattern} matched no report files`)
  }
  return files
})

function generateStats(suites, reports) {
  const tests = getAllTests(suites)
  const passes = tests.filter(test => test.state === 'passed')
  const pending = tests.filter(test => test.state === 'pending')
  const failures = tests.filter(test => test.state === 'failed')
  const skipped = tests.filter(test => test.state === 'skipped')
  
  const timeStats = getStateTimeSpan(reports)
  
  return {
    suites: suites.length,
    tests: tests.length,
    passes: passes.length,
    pending: pending.length,
    failures: failures.length,
    testsRegistered: tests.length,
    passPercent: (passes.length * 100) / tests.length,
    pendingPercent: (pending.length * 100) / tests.length,
    other: 0,
    hasOther: false,
    skipped: skipped.length,
    hasSkipped: !!skipped.length,
    ...timeStats
  }
}

function collectReportFiles(files) {
  return Promise.all(files.map(filename => fse.readJson(filename)))
}

const collectReportSuites = flatMap(report =>
  report.results.filter(r => r !== false)
)

const getAllTests = flatMap(suite => [
  ...suite.tests,
  ...getAllTests(suite.suites),
])

const getStateTimeSpan = reports => {
  const spans = reports.map(({ stats: { start, end } }) => {
    return { start: new Date(start), end: new Date(end) }
  })

  const maxSpan = spans.reduce(
    (currentMaxSpan, span) => {
      const start = new Date(
        Math.min(currentMaxSpan.start.getTime(), span.start.getTime())
      )
      const end = new Date(
        Math.max(currentMaxSpan.end.getTime(), span.end.getTime())
      )
      return { start, end }
    }
  )

  return {
    start: maxSpan.start.toISOString(),
    end: maxSpan.end.toISOString(),
    duration: maxSpan.end.getTime() - maxSpan.start.getTime()
  }
}

exports.merge = async function merge(options) {
  options = resolveOptions(options)
  const files = collectSourceFiles(options.files)
  const reports = await collectReportFiles(files)
  const suites = collectReportSuites(reports)

  return {
    stats: generateStats(suites, reports),
    results: suites,
    meta: reports[0].meta,
  }
}
