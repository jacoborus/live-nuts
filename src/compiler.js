'use strict'

const compileText = require('./compilers/text.js')
const compileTag = require('./compilers/tag.js')
// const compileLoop = require('./compilers/loop.js')

module.exports = function compile (schema, callback) {
  if (schema.type === 1) {
    if ('repeat' in schema) {
      // compileLoop(schema, compile, callback)
    } else {
      compileTag(schema, compile, callback)
    }
  } else if (schema.type === 3) {
    compileText(schema, callback)
  }
}
