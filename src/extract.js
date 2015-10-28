'use strict'

import newCounter from './counter.js'

function extract (element, scope, callback) {
  let scopeAtt = element.getAttribute('nu-scope')
  if (scopeAtt) {
    scope[scopeAtt] = scope[scopeAtt] || {}
  }
  let innerScope = scopeAtt ? scope[scopeAtt] : scope
  let model = element.getAttribute('nu-model')
  if (model !== null) {
    if (model) {
      innerScope[model] = element.innerText
    } else {
      innerScope = element.innerText
    }
    return callback()
  }

  // skip if element has no children
  if (!element.children.length) return callback()
  // launch callback after children data is extracted
  let count = newCounter(element.children.length, callback)
  Array.prototype.forEach.call(element.children, child => {
    extract(child, innerScope, count)
  })
}

export default extract
