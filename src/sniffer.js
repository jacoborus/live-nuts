'use strict'

import newCounter from './counter.js'

function sniffer (element, model, callback) {
  if (!element.children.length) return callback()
  let count = newCounter(element.children.length, callback)
  Array.prototype.forEach.call(element.children, child => {
    let att = child.getAttribute('nu-model')
    if (att) {
      model[att] = child.innerText
      return count()
    }

    if (child.children.length) {
      sniffer(child, model, count)
    } else {
      count()
    }
  })
}

export default sniffer
