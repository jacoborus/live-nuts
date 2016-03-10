'use strict'

export default function (scope, box, methods = {}) {
  function save (target) {
    if (!target) {
      target = scope
    } else if (typeof target !== 'object') {
      throw new Error('save requires a object an argument')
    }
    box.save(target)
  }
  let nut = { save, scope }
  let { regular, factory, injected } = methods
  if (regular) {
    Object.keys(regular).forEach(k => nut[k] = regular[k])
  }
  if (factory) {
    Object.keys(factory).forEach(k => nut[k] = factory[k](nut))
  }
  if (injected) {
    Object.keys(injected).forEach(k => nut[k] = injected[k])
  }
  return nut
}
