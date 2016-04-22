'use strict'

const reqs = require('./requirements.js')
const compileElement = require('./element.js')
const compileAttributes = require('./attribute.js')
const compileEvents = require('./event.js')
const getNut = require('../nut.js')
const compileChildren = require('./children.js')

module.exports = function (schema, compile) {
  let { localName, events, model, children } = schema
  let renderChildren

  let getScope
  if (model) {
    getScope = scope => scope[model]
  } else {
    getScope = scope => scope
  }

  let { renders, fixed } = compileAttributes(schema)
  let createBaseTag = compileElement(localName, fixed)
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

  let regulator = reqs(schema)
  let checker
  if ('if' in schema && 'model' in schema) {
    let nuif = schema.if
    checker = function (scope) {
      return Boolean(scope[model][nuif])
    }
  } else {
    checker = false
  }

  if (!regulator && !checker) {
    schema.print = function (scope, emitter, nut, item) {
      if (!item.elem) {
        item.elem = schema.render(scope, emitter, nut)
        item.printed = true
        item.needUpdate = true
      }
    }
  } else if (regulator && !checker) {
    schema.print = function (scope, emitter, nut, item) {
      let pass = regulator(scope)
      if (pass && !item.elem) {
        item.elem = schema.render(scope, emitter, nut)
        item.printed = true
        item.needUpdate = true
      } else {
        item.printed = false
        item.needUpdate = true
      }
    }
  } else {
    schema.print = function (scope, emitter, nut, item) {
      let pass = regulator(scope)
      let check
      if (pass) {
        check = checker(scope)
      }
      if (pass && check) {
        if (!item.elem) {
          item.elem = schema.render(scope, emitter, nut)
          item.printed = true
          item.needUpdate = true
        }
      } else if (item.elem) {
        item.printed = false
        item.needUpdate = true
      }
    }
  }
}
