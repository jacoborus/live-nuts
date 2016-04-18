'use strict'

module.exports = function (scope, schema, parentNut) {
  if (!schema.tagName) return parentNut
  let { methods, injected } = schema
  let nut = { scope }

  // add methods
  if (methods) {
    Object.keys(methods).forEach(k => {
      if (k.startsWith('_')) {
        // factory methods
        nut[k.slice(1)] = methods[k](nut)
      } else {
        // regular methods
        nut[k] = methods[k]
      }
    })
  }
  if (injected) {
    injected.forEach(k => {nut[k] = parentNut[k]})
  }
  return nut
}
