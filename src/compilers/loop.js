'use strict'

const newCounter = require('../counter.js')
const compileTag = require('./tag.js')
const createNut = require('../nut.js')

module.exports = function (schema, callback) {
  let { repeat } = schema
  schema.loop = (outerScope, box, parentNut) => {
    let scope = outerScope[repeat]
    let res = {}
    if (!scope || !scope.length) {
      res.isRendered = false
      res.subscription = () => {
        scope = outerScope[repeat]
        if (scope && scope.length) {
          // render loop
        }
      }
      return res
    } else {
      let nut = createNut(scope, box, schema)
      return {
        isRendered: true,
        element: document.createDocumentFragment(),
        subscription
      }
    }
  }
  compileTag(schema, callback)
}
