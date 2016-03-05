'use strict'

import newCounter from '../counter.js'
import compileAttributes from './attribute-compiler.js'
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
  let { events, children, attribs, repeat, model } = schema
  let stack = createStack()

  let getScope
  if (model) {
    getScope = scope => scope[model][repeat]
  } else {
    getScope = scope => scope[repeat]
  }

  schema.render = (scope, box) => {
    let fragment = document.createDocumentFragment()
    scope = getScope(scope)

    if (scope) {
      scope.forEach(item => {
        let nut = { scope: item, el: document.createElement(schema.localName) }
        stack.exec(nut, box)
        fragment.appendChild(nut.el)
      })
    }
    return fragment
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

