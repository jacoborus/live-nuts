'use strict'

const compileElement = require('./element.js')
const compileAttributes = require('./attribute.js')
const compileEvents = require('./event.js')
const getNut = require('../nut.js')
const compileChildren = require('./children.js')

module.exports = function (schema, compile) {
  let { tagName, events, model, children } = schema
  let renderChildren

  let getScope
  if (model) {
    getScope = scope => scope[model]
  } else {
    getScope = scope => scope
  }

  let { renders, fixed } = compileAttributes(schema)
  let createBaseTag = compileElement(tagName, fixed)
  const renderEvents = compileEvents(events)

  if (children) {
    renderChildren = compileChildren(children, compile)
  }

  schema.render = (outerScope, emitter, parentNut) => {
    const scope = getScope(outerScope)
    const el = createBaseTag()
    const subscriptions = []
    const updater = () => subscriptions.forEach(update => update())

    emitter.on(scope, updater)
    let nut = getNut(scope, schema, emitter, parentNut)
    // render attrributes
    if (renders.length) {
      subscriptions.push(...renders.map(r => r(el, scope)))
    }
    if (renderEvents) {
      renderEvents(el, nut)
    }
    if (renderChildren) {
      renderChildren(scope, emitter, nut, el)
    }
    return el
  }
}
