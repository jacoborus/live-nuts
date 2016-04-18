'use strict'

const matcher = /{{([^}]*)}}/
const compileStr = require('./string.js')

module.exports = function (schema) { // compile attributes
  const atts = schema.attribs
  const renders = []
  const fixed = {}
  if (!atts) return { fixed, renders }
  Object.keys(atts).map(name => {
    const value = atts[name]
    if (name.endsWith('-')) {
      // is boolean
      const att = name.slice(0, -1)
      const prop = value.match(matcher)[1].trim()
      schema.booleans = schema.booleans || {}
      schema.booleans[att] = prop
      const updater = (scope, cached, el) => {
        const fresh = scope[prop]
        if (fresh === cached) return cached
        if (fresh) {
          el.setAttribute(att, '')
        } else {
          el.removeAttribute(att)
        }
        return fresh
      }
      renders.push(function (el, scope) {
        let cached = scope[prop]
        if (cached) {
          el.setAttribute(att, '')
        } else {
          el.removeAttribute(att)
        }
        return () => {cached = updater(scope, cached, el)}
      })
    } else if (!value.match(matcher)) {
      // is fixed
      fixed[name] = value
    } else {
      // is scoped value
      const reduce = compileStr(value)
      const updater = (scope, cached, el) => {
        const fresh = reduce(scope)
        if (fresh === cached) return cached
        el.setAttribute(name, fresh)
        return fresh
      }
      renders.push(function (el, scope) {
        let cached = reduce(scope)
        el.setAttribute(name, cached)
        return () => {cached = updater(scope, cached, el)}
      })
    }
  })
  return { fixed, renders }
}
