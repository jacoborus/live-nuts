'use strict'

const reqs = require('./requirements.js')
const compile = require('../compiler.js')

module.exports = function (children) {
  children.forEach((schema, i) => {
    compile(schema)
    schema.req = reqs(schema)
    schema.pos = i
  })
  return (scope, emitter, nut, el) => {
    children.forEach((schema) => {
      if (schema.req(scope)) {
        let elem = schema.render(scope, emitter, nut)
        console.log(elem)
        el.appendChild(elem)
      }
    })
  }
}
