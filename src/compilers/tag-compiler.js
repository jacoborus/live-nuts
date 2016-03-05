'use strict'

import compileAttributes from './attribute-compiler.js'
import newCounter from '../counter.js'
import compileEvents from './event-compiler.js'
import compileChildren from './children-compiler.js'

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
    if (!scope) return document.createDocumentFragment()
    let nut = { scope, el: document.createElement(schema.localName) }
    stack.exec(nut, box)
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
