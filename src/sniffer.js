'use strict'

export default function (element) {
  let model = {}
  Array.prototype.forEach.call(element.children, child => {
    let att = child.getAttribute('nu-model')
    if (att) {
      model[att] = child.innerText
    }
  })
  return model
}
