'use strict'

import extend from './extend.js'
import newCounter from './counter.js'

function extendInside (nut, schemas, next) {
  if (nut.childrenFrom || !nut.children || !nut.children.length) {
    return next()
  }
  let countExtend = newCounter(nut.children.length, function () {
    let countInside = newCounter(nut.children.length, next)
    nut.children.forEach(child => extendInside(child, schemas, countInside))
  })
  nut.children.forEach(child => extend(child, schemas.get(child.as), countExtend))
}

// detect circular dependencies inside an schema
function hasCircular (arr, key, schemas) {
  if (!schemas.get(key).as) return false
  if (arr.indexOf(key) > -1) return true
  arr.push(key)
  return hasCircular(arr, schemas.get(key).as, schemas)
}

export default function (schemas, callback) {
  let keys = [...schemas.keys()]
  // detect circular dependencies in all schemas
  if (keys.some(key => hasCircular([], key, schemas))) {
    throw new Error('circular dependencies between nuts not allowed')
  }
  // iterate nuts
  (function next () {
    if (keys.length) {
      // first extend the main template tags
      let nut = schemas.get(keys.shift())
      if (!nut.as) return next()
      if (schemas.get(nut.as).as) {
        keys.push(nut.key)
      } else {
        extend(nut, schemas.get(nut.as), next)
      }
    } else {
      // then extend the children tags inside main tags
      let count = newCounter(schemas.size, callback)
      schemas.forEach(value => extendInside(value, schemas, count))
    }
  })()
}
