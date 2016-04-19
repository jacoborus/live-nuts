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
  children.forEach((schema, i) => {
    compile(schema)
    schema.req = reqs(schema)
    schema.pos = i
  })
  return (scope, emitter, nut, el) => {
    let list = []
    function updater () {
      let last = ''
      children.forEach((c, i) => {
        let elem = list[i - 1]
        if (c.req(scope)) {
          if (!elem) {
            let elem = c.render(scope, emitter, nut)
            insertInPos(last, el, elem)
            list[i - 1] = elem
            last = elem
          }
        } else if (elem) {
          el.removechild[elem]
          delete list[i - 1]
        }
      })
    }
    emitter.on(scope, updater)
    updater()
  }
}
