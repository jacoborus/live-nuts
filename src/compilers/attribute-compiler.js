'use strict'

const matcher = /{{([^}]*)}}/
import compileStr from './string-compiler.js'

export default function compileAttributes (schema) { // compile attributes
  let atts = schema.attribs
  let fns = Object.keys(atts).map(name => {
    let value = atts[name]
    if (name.endsWith('-')) {
      // is boolean
      let att = name.slice(0, -1)
      let prop = value.match(matcher)[1].trim()
      schema.booleans = schema.booleans || {}
      schema.booleans[att] = prop
      let updateFn = (scope, cached, el) => {
        let fresh = scope[prop]
        if (fresh !== cached) {
          if (fresh) {
            el.setAttribute(att, '')
          } else {
            el.removeAttribute(att)
          }
          return fresh
        } else {
          return cached
        }
      }
      return function (nut, box) {
        let scope = nut.scope
        let cached = scope[prop]
        let el = nut.el
        box.subscribe(() => cached = updateFn(scope, cached, el), nut.scope)
        if (cached) {
          el.setAttribute(att, '')
        } else {
          el.removeAttribute(att)
        }
      }
    } else {
      // is regular
      if (!value.match(matcher)) {
        return nut => nut.el.setAttribute(name, value)
      }
      // is scoped value
      let reduce = compileStr(value)
      let updateFn = (scope, cached, el) => {
        let fresh = reduce(scope)
        if (fresh !== cached) {
          el.setAttribute(name, fresh)
          return fresh
        }
        return cached
      }
      return function (nut, box) {
        let scope = nut.scope
        let el = nut.el
        let cached = reduce(scope)
        box.subscribe(() => cached = updateFn(scope, cached, el), nut.scope)
        el.setAttribute(name, cached)
      }
    }
  })
  return (nut, box) => fns.forEach(fn => fn(nut, box))
}
