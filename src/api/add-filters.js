'use strict'

export default function (archive, next) {
  return function (filters) {
    Object.keys(filters).forEach(name => archive.set(name, filters[name]))
    next()
  }
}
