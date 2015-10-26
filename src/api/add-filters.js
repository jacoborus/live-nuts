'use strict'

export default function (filtersArchive, next) {
  return function (filters) {
    Object.keys(filters).forEach(name => {
      filtersArchive.set(name, filters[name])
    })
    next()
  }
}
