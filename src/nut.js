'use strict'

export default function (scope, box, schema = {}) {
  let { factories, methods, injected } = schema
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
    Object.keys(methods).forEach(k => nut[k] = methods[k])
  }
  if (factories) {
    Object.keys(factories).forEach(k => nut[k] = factories[k](nut))
  }
  if (injected) {
    Object.keys(injected).forEach(k => nut[k] = injected[k])
  }
  return nut
}
