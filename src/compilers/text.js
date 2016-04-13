'use strict'

const matcher = /{{([^}]*)}}/
const compileStr = require('./string.js')

module.exports = function (schema, callback) {
  const data = schema.data
  if (data.match(matcher)) {
    // text node has scoped content
    const reduce = compileStr(data)
    const updateFn = (scope, cached, el) => {
      const fresh = reduce(scope)
      if (fresh !== cached) {
        el.textContent = fresh
        return fresh
      }
      return cached
    }
    schema.render = function (scope) {
      let cached = reduce(scope)
      const el = document.createTextNode(cached)
      const subscription = () => updateFn(scope, cached, el)
      return { el, subscription }
    }
  } else {
    // is regular text node
    schema.render = () => ({el: document.createTextNode(data)})
  }
  callback()
}
