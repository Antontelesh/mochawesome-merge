# mochawesome-merge

[![CircleCI](https://circleci.com/gh/Antontelesh/mochawesome-merge.svg?style=svg)](https://circleci.com/gh/Antontelesh/mochawesome-merge)
[![codecov](https://codecov.io/gh/Antontelesh/mochawesome-merge/branch/master/graph/badge.svg)](https://codecov.io/gh/Antontelesh/mochawesome-merge)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Merge several [Mochawesome](https://github.com/adamgruber/mochawesome) JSON reports

## Installation

via `yarn`:

```
$ yarn add mochawesome-merge --dev
```

via `npm`:

```
$ npm install mochawesome-merge --save-dev
```

## Usage

```javascript
const { merge } = require('mochawesome-merge')

// See Options below
const options = {
  reportDir: 'report',
}
merge(options).then(report => {
  console.log(report)
})
```

## CLI

```
$ mochawesome-merge --reportDir [directory] > output.json
```

## Options

- `reportDir` (optional) — source mochawesome JSON reports directory. Defaults to `mochawesome-report`.

## [Cypress](https://github.com/cypress-io/cypress)

The main motivation to create this library was to be able to use [mochawesome](https://github.com/adamgruber/mochawesome) together with [Cypress](https://github.com/cypress-io/cypress).

Since the version `3.0.0`, Cypress runs every spec separately, which leads to generating multiple mochawesome reports, one for each spec. `mochawesome-merge` can be used to merge these reports and then generate one HTML report for all your cypress tests.

First, configure `cypress.json`:

```jsonc
{
  // use mochawesome reporter as usually
  "reporter": "mochawesome",
  "reporterOptions": {
    // disable overwrite to generate many JSON reports
    "overwrite": false,
    // do not generate intermediate HTML reports
    "html": false,
    // generate intermediate JSON reports
    "json": true
  }
}
```

Then, write your custom script to run `cypress` together with `mochawesome-merge`:

```javascript
const cypress = require('cypress')
const marge = require('mochawesome-report-generator')
const { merge } = require('mochawesome-merge')

cypress.run().then(
  () => {
    generateReport()
  },
  error => {
    generateReport()
    console.error(error)
    process.exit(1)
  }
)

function generateReport(options) {
  return merge(options).then(report => marge.create(report, options))
}
```

Alternatively, you can use CLI to merge JSON reports and generate HTML report.
For example, an AWS CodeBuild `buildspec.yml` file might look something like this:

```yaml
phases:
  install:
    commands:
      - yarn install
  build:
    commands:
      - yarn cypress run
  post_build:
    commands:
      - yarn mochawesome-merge > mochawesome.json
      - yarn marge mochawesome.json
```
