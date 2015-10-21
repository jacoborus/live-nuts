'use strict'

const extend = require('./extend.js')

function newCounter (limit, callback) {
  let count = 0
  return function (err) {
    if (err) { return callback(err)}
    if (++count === limit) {
      callback()
    }
  }
}

function extendInside (nut, templates, next) {
  if (nut.childrenFrom || !nut.children || !nut.children.length) {
    return next()
  }
  let countExtend = newCounter(nut.children.length, function () {
    let countInside = newCounter(nut.children.length, next)
    nut.children.forEach(child => extendInside(child, templates, countInside))
  })
  nut.children.forEach(child => extend(child, templates[child.as], countExtend))
}

function hasCircular (arr, key, templates) {
  if (!templates[key].as) {
    return false
  }
  if (arr.indexOf(key) > -1) {
    return true
  }
  arr.push(key)
  return hasCircular(arr, templates[key].as, templates)
}

module.exports = function (templates, callback) {
  let keys = Object.keys(templates)
  // detect circular dependencies
  if (keys.some(key => hasCircular([], key, templates))) {
    throw new Error('circular dependencies between nuts not allowed')
  }
  // iterate nuts
  function next () {
    if (keys.length) {
      let nut = templates[keys.shift()]
      if (!nut.as) return next()
      if (templates[nut.as].as) {
        keys.push(nut.key)
      } else {
        extend(nut, templates[nut.as], next)
      }
    } else {
      let count = newCounter(Object.keys(templates).length, callback)
      for (let key in templates) {
        extendInside(templates[key], templates, count)
      }
    }
  }
  next()
}
