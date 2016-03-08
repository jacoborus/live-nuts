'use strict'

import compileAttributes from './attribute.js'
import newCounter from '../counter.js'
import compileEvents from './event.js'
import compileChildren from './children.js'

function createStack () {
  let renders = []
  return {
    add: fn => renders.push(fn),
    exec: (nut, box) => renders.forEach(fn => fn(nut, box))
  }
}

export default function (schema, compile, callback) {
  let { events, children, attribs, model } = schema
  let stack = createStack()

  let getScope
  if (model) {
    getScope = scope => scope[model]
  } else {
    getScope = scope => scope
  }

  schema.render = (scope, box) => {
    scope = getScope(scope)
    let el
    if (!scope) {
      el = document.createDocumentFragment()
    } else {
      el = document.createElement(schema.localName)
    }
    let save = target => {
      if (!target) {
        target = scope
      } else if (typeof target !== 'object') {
        throw new Error('save requires a object an argument')
      }
      box.save(target)
    }
    let nut = { scope, el, save }
    // render attrributes
    let subscriptions = stack.exec(nut, box)
    box.subscribe(() => subscriptions.forEach(update => update()), scope)
    return nut.el
  }

  if (attribs) stack.add(compileAttributes(schema))
  if (events) stack.add(compileEvents(events))
  if (children) {
    stack.add(compileChildren(children))
    let count = newCounter(children.length, callback)
    children.forEach(c => compile(c, count))
  } else {
    callback()
  }
}
