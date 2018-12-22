# mochawesome-merge

[![CircleCI](https://circleci.com/gh/Antontelesh/mochawesome-merge.svg?style=svg)](https://circleci.com/gh/Antontelesh/mochawesome-merge)
[![codecov](https://codecov.io/gh/Antontelesh/mochawesome-merge/branch/master/graph/badge.svg)](https://codecov.io/gh/Antontelesh/mochawesome-merge)

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
