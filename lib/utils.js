const map = (fn, collection) => collection.map(fn)

const flatten = collection =>
  collection.reduce((acc, arr) => [...acc, ...arr], [])

const flatMap = (fn, collection) => flatten(map(fn, collection))

module.exports = {
  map,
  flatten,
  flatMap,
}
