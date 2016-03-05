'use strict'

import compileText from './compilers/text-compiler.js'
import compileTag from './compilers/tag-compiler.js'
import compileLoop from './compilers/loop-compiler.js'

export default function compile (schema, callback) {
  if (schema.type === 1) {
    if ('repeat' in schema) {
      compileLoop(schema, compile, callback)
    } else {
      compileTag(schema, compile, callback)
    }
  } else if (schema.type === 3) {
    compileText(schema, callback)
  }
}
