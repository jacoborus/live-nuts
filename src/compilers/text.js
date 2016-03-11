'use strict'

const matcher = /{{([^}]*)}}/
import compileStr from './string.js'

export default function (schema, callback) {
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
      return {
        element: el,
        isRendered: true
      }
    }
  } else {
    // is regular text node
    schema.render = () => {
      return {
        element: document.createTextNode(data),
        isRendered: true
      }
    }
  }
  callback()
}
