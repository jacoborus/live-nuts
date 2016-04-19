'use strict'

const compileText = require('./compilers/text.js')
const compileTag = require('./compilers/tag.js')

module.exports = function compile (schema) {
  if (schema.type === 1) {
    if ('repeat' in schema) {
      // compileLoop(schema, compile)
    } else {
      compileTag(schema, compile)
    }
  } else if (schema.type === 3) {
    compileText(schema)
  }
}
