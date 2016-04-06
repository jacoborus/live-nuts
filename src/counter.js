'use strict'

module.exports = function newCounter (limit, callback) {
  let count = 0
  return function (err) {
    if (err) { return callback(err)}
    if (++count >= limit) {
      callback()
    }
  }
}
