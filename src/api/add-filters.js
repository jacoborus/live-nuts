'use strict'

/**
 * Factory function add filters
 *
 * @param {object} archive filters archive
 * @param {function} next callback
 * @return {function} function that adds filters into filters archive
 */
export default function (archive, next) {
  return function (filters) {
    Object.keys(filters).forEach(name => archive.set(name, filters[name]))
    next()
  }
}
