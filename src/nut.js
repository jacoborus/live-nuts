'use strict'

export default function (scope, box, schema = {}) {
  let { methods, injected } = schema
  function save (target) {
    if (!target) {
      target = scope
    } else if (typeof target !== 'object') {
      throw new Error('save requires a object an argument')
    }
    box.save(target)
  }
  let nut = { save, scope }
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
    Object.keys(injected).forEach(k => nut[k] = injected[k])
  }
  return nut
}
