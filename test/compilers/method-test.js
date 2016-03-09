'use strict'

import test from 'tape'
import compileMethods from '../../src/compilers/method.js'

test('compile methods', function (t) {
  let methods = {
    a: 1,
    b: 2
  }
  let nut = {}
  let compiled = compileMethods(methods)
  compiled(nut)
  t.is(nut.a, 1)
  t.is(nut.b, 2)
  t.end()
})
