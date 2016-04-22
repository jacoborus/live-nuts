'use strict'

const reqs = require('./requirements.js')

function insertInPos (last, parent, child) {
  if (last) {
    parent.insertBefore(child, last.nextSibling)
  } else {
    parent.insertBefore(child, parent.firstChild)
  }
}

module.exports = function (children, compile) {
  children.forEach((schema) => {
    compile(schema)
    schema.req = reqs(schema)
  })
  return (scope, emitter, nut, el) => {
    let list = []
    function updater () {
      let last = ''
      children.forEach((c, i) => {
        let elem = list[i]
        if (c.req(scope)) {
          if (!elem) {
            let elem = c.render(scope, emitter, nut)
            insertInPos(last, el, elem)
            list[i] = elem
            last = elem
          } else {
            last = elem
          }
        } else if (elem) {
          el.removeChild(elem)
          delete list[i]
        }
      })
    }
    emitter.on(scope, updater)
    updater()
  }
}
