'use strict'

import compileAttributes from './attribute.js'
import newCounter from '../counter.js'
import compileEvents from './event.js'
import compileChildren from './children.js'
import compileElement from './element.js'
import createNut from '../nut.js'

export default function (schema, compile, callback) {
  let { tagName, events, children, attribs, model } = schema
  let renderAtts, fixedAtts, renderEvents, renderChildren

  let getScope
  if (model) {
    getScope = scope => scope[model]
  } else {
    getScope = scope => scope
  }

  if (attribs) {
    let temp = compileAttributes(schema)
    renderAtts = temp.renders
    fixedAtts = temp.fixed
  }
  let createBaseTag = compileElement(tagName, fixedAtts)
  if (events) {
    renderEvents = compileEvents(events)
  }

  schema.render = (outerScope, box, parentNut) => {
    let scope = getScope(outerScope)
    let el
    if (!scope) {
      let unsubscribe
      let updateElement = () => {
        if (outerScope[model] && typeof outerScope[model] === 'object') {
          schema.render(outerScope, box, parentNut)
          unsubscribe()
        }
      }
      unsubscribe = box.subscribe(updateElement, outerScope)
      return document.createDocumentFragment()
    } else {
      el = createBaseTag()
      let nut = createNut(scope, box)
      // render attrributes
      if (renderAtts) {
        let subscriptions = renderAtts.map(r => r(el, scope))
        box.subscribe(() => subscriptions.forEach(update => update()), scope)
      }
      if (renderChildren) {
        renderChildren()
      }
      if (renderEvents) {
        renderEvents(el, nut)
      }
      return el
    }
  }

  if (children) {
    renderChildren = compileChildren(children)
    let count = newCounter(children.length, callback)
    children.forEach(c => compile(c, count))
  } else {
    callback()
  }
}
