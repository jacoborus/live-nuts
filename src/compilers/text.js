'use strict'

const matcher = /{{([^}]*)}}/
const compileStr = require('./string.js')

module.exports = function (schema, callback) {
  let data = schema.data
  if (data.match(matcher)) {
    // text node has scoped content
    let reduce = compileStr(data)
    let updateFn = (scope, cached, el) => {
      let fresh = reduce(scope)
      if (fresh !== cached) {
        el.textContent = fresh
        return fresh
      }
      return cached
    }
    schema.render = function (scope, box) {
      let cached = reduce(scope)
      let el = document.createTextNode(cached)
      box.subscribe(() => updateFn(scope, cached, el), scope)
      return el
    }
  } else {
    // is regular text node
    schema.render = () => {
      return document.createTextNode(data)
    }
  }
  callback()
}
