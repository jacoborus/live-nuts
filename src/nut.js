'use strict'

module.exports = function (scope, box, schema, parentNut = {}) {
  let { methods, injected } = schema
  let nut = {
    scope,
    save (target) {
      if (!target) {
        target = scope
      } else if (typeof target !== 'object') {
        throw new Error('save requires a object an argument')
      }
      box.save(target)
    },
    subscribe (action, target) {
      if (!target) {
        target = scope
      }
      box.subscribe(action, target)
    }
  }
  if (methods) {
    Object.keys(methods).forEach(k => {
      if (k.startsWith('_')) {
        nut[k.slice(1)] = methods[k](nut)
      } else {
        nut[k] = methods[k]
      }
    })
  }
  if (injected) {
    injected.forEach(k => {nut[k] = parentNut[k]})
  }
  return nut
}
