'use strict'

const compileAttributes = require('./attribute.js')
const newCounter = require('../counter.js')
const compileEvents = require('./event.js')
const compileChildren = require('./children.js')
const compileElement = require('./element.js')
const createNut = require('../nut.js')
const reqs = require('./requirements.js')
const boxes = require('boxes')

module.exports = function (schema, compile, callback) {
  let { localName, events, children, attribs, model } = schema
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
