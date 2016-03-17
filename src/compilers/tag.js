'use strict'

import compileAttributes from './attribute.js'
import newCounter from '../counter.js'
import compileEvents from './event.js'
import compileChildren from './children.js'
import compileElement from './element.js'
import createNut from '../nut.js'
import reqs from './requirements.js'
import boxes from 'boxes'

export default function (schema, compile, callback) {
  let { localName, events, children, attribs, model, methods } = schema
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
  let createBaseTag = compileElement(localName, fixedAtts)
  if (events) {
    renderEvents = compileEvents(events)
  }

  schema.render = (outerScope, box = boxes(), parentNut = {}) => {
    let scope = getScope(outerScope)
    let el = createBaseTag()
    let nut = createNut(scope, box, schema, parentNut)
    // render attrributes
    if (renderAtts) {
      let subscriptions = renderAtts.map(r => r(el, scope))
      box.subscribe(() => subscriptions.forEach(update => update()), scope)
    }
    if (renderEvents) {
      renderEvents(el, nut)
    }
    if (renderChildren) {
      renderChildren(scope, box, nut, el)
    }
    return el
  }

  schema.print = (scope, parentElement, box) => {
    box = box || boxes(scope)
    if (reqs(schema)(scope)) {
      let el = schema.render(scope, box)
      if (parentElement) parentElement.appendChild(el)
      return el
    } else {
      return document.createDocumentFragment()
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
