'use strict'

const matcher = /{{([^}]*)}}/
const compileStr = require('./string.js')

module.exports = function (schema) { // compile attributes
  let atts = schema.attribs
  let renders = []
  let fixed = {}
  Object.keys(atts).map(name => {
    let value = atts[name]
    if (name.endsWith('-')) {
      // is boolean
      let att = name.slice(0, -1)
      let prop = value.match(matcher)[1].trim()
      schema.booleans = schema.booleans || {}
      schema.booleans[att] = prop
      let updater = (scope, cached, el) => {
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
      renders.push(function (el, scope) {
        let cached = scope[prop]
        if (cached) {
          el.setAttribute(att, '')
        } else {
          el.removeAttribute(att)
        }
        return () => cached = updater(scope, cached, el)
      })
    } else if (!value.match(matcher)) {
      // is fixed
      fixed[name] = value
    } else {
      // is scoped value
      let reduce = compileStr(value)
      let updater = (scope, cached, el) => {
        let fresh = reduce(scope)
        if (fresh !== cached) {
          el.setAttribute(name, fresh)
          return fresh
        }
        return cached
      }
      renders.push(function (el, scope) {
        let cached = reduce(scope)
        el.setAttribute(name, cached)
        return () => cached = updater(scope, cached, el)
      })
    }
  })
  return { fixed, renders }
}
