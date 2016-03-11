'use strict'

import compileAttributes from './attribute.js'
import newCounter from '../counter.js'
import compileEvents from './event.js'
import compileChildren from './children.js'
import compileElement from './element.js'
import createNut from '../nut.js'

export default function (schema, compile, callback) {
  let { tagName, events, children, attribs, model, methods, injected } = schema
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
      let res = {
        idRendered: false
      }
      let updateElement = () => {
        if (outerScope[model] && typeof outerScope[model] === 'object') {
          let tempRes = schema.render(outerScope, box, parentNut)
          res.isRendered = true
          res.element = tempRes.element
          res.subscribe = tempRes.subscribe
        }
      }
      res.subscribe = updateElement
      return res
    } else {
      el = createBaseTag()
      let nut = createNut(scope, box, { methods, injected })
      // render attrributes
      if (renderAtts) {
        let subscriptions = renderAtts.map(r => r(el, scope))
        box.subscribe(() => subscriptions.forEach(update => update()), scope)
      }
      if (renderEvents) {
        renderEvents(el, nut)
      }
      if (renderChildren) {
        let vChildren = renderChildren(scope, box, nut)
        vChildren.forEach(v => {
          if (v.isRendered) {
            el.appendChild(v.element)
          }
        })
      }
      return {
        isRendered: true,
        element: el,
        subscribe: false
      }
    }
  }

  schema.print = (scope, box) => {
    return schema.render(scope, box).element || document.createDocumentFragment()
  }

  if (children) {
    renderChildren = compileChildren(children)
    let count = newCounter(children.length, callback)
    children.forEach(c => compile(c, count))
  } else {
    callback()
  }
}
