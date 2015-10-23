'use strict'

import newCounter from './counter.js'

function extract (element, scope, callback) {
  let model = element.getAttribute('nu-model')
  if (model !== null) {
    if (model) {
      scope[model] = element.innerText
    } else {
      scope = element.innerText
    }
    return callback()
  }

  // skip if element has no children
  if (!element.children.length) return callback()
  // launch callback after children data is extracted
  let count = newCounter(element.children.length, callback)
  Array.prototype.forEach.call(element.children, child => {
    extract(child, scope, count)
  })
}

export default extract
