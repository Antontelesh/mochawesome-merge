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

## Examples

### JavaScript API

```javascript
const { merge } = require('mochawesome-merge')

// See Params section below
const options = {
  files: [
    './report/*.json',

    // you can specify more files or globs if necessary:
    './mochawesome-report/*.json',
  ],
}

merge(options).then(report => {
  console.log(report)
})
```

### CLI

```
$ npx mochawesome-merge ./report/*.json -o output.json
```

or legacy usage

```
$ npx mochawesome-merge ./report/*.json > output.json
```

You can specify as many paths as you wish:

```
$ npx mochawesome-merge ./report/*.json ./mochawesome-report/*.json -o output.json
```

You can also use a named option for the files like so:

```
$ npx mochawesome-merge -f ./report/*.json ./mochawesome-report/*.json -o output.json
```

### Params

- `files`: list of source report file paths. Can include glob patterns.
- Aliases: `-f | --files` or first positional argument
- Defaults to `["./mochawesome-report/mochawesome*.json"]`.
#
- `output`: a file path to the bundled results. Should be a `json` file 
- Aliases: `-o | --output`
- Defaults to `stdout`.

## Migration to v4

Version 4 has come with a breaking change —
it no more accepts params like `reportDir` or `rootDir`.
Instead, it now accepts a list of file paths or glob patterns
to source report files. If you are migrating to version 4
you likely have to change your params accordignly.

### JavaScript API

Let's say you have a bunch of reports that you want to merge
under `./mochawesome-report` directory.
Then you're probably using mochawesome-merge like this:

```js
merge({
  reportDir: "mochawesome-report",
});
```

After switching to version 4 you need to rename
`reportDir` param to `files`
and change the value to point to your files
rather than the directory:

```diff
merge({
-  reportDir: "mochawesome-report",
+  files: ["./mochawesome-report/*.json"],
})
```

### CLI

After upgrading to version 4 all you need
is to remove the `--reportDir` option
and instead specify a glob pattern
or several ones if necessary, separating each one with a space:

```diff
- npx mochawesome-merge --reportDir mochawesome-report > mochawesome.json
+ npx mochawesome-merge ./mochawesome-report/*.json > mochawesome.json
```

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
