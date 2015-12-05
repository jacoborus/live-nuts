'use strict'

export default function newCounter (limit, callback) {
  let count = 0
  return function (err) {
    if (err) { return callback(err)}
    if (++count >= limit) {
      callback()
    }
  }
}
