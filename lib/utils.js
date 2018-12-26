const pipe = (...fns) => value => fns.reduce((acc, fn) => fn(acc), value)

const map = fn => collection => collection.map(fn)

const flatten = collection =>
  collection.reduce((acc, arr) => [...acc, ...arr], [])

const flatMap = fn =>
  pipe(
    map(fn),
    flatten
  )

module.exports = {
  pipe,
  map,
  flatten,
  flatMap,
}
