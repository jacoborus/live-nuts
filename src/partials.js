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
  if (nut.extended || !nut.children || !nut.children.length) {
    return next()
  }
  // let countExtend = newCounter(nut.children.length, function () {
  //   let countInside = newCounter(nut.children.length, next)
  //   nut.children.forEach(child => extendInside(child, templates, countInside))
  // })
  let countExtend = newCounter(nut.children.length, next)
  nut.children.forEach(child => extend(child, templates[child.as], countExtend))
}

module.exports = function (templates, callback) {
  let keys = Object.keys(templates)

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
