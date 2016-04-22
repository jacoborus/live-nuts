'use strict'

const extend = require('./extend.js')
const newCounter = require('./counter.js')

function engageChildren (schema, schemas, next) {
  if (schema.childrenFrom || !schema.children || !schema.children.length) {
    return next()
  }
  let countExtend = newCounter(schema.children.length, function () {
    let countInside = newCounter(schema.children.length, next)
    schema.children.forEach(child => engageChildren(child, schemas, countInside))
  })
  schema.children.forEach(child => extend(child, schemas.get(child.localName), countExtend))
}

module.exports = function (schemas, callback) {
  let count = newCounter(schemas.size, callback)
  schemas.forEach(value => engageChildren(value, schemas, count))
}
