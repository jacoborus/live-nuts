'use strict'

import test from 'tape'
import compileStr from '../../src/compilers/string-compiler.js'

test('parse simple string', function (t) {
  let str = '{{ color }}'
  let reduce = compileStr(str)
  t.is(reduce({color: 0}), 0)
  t.is(reduce({color: 1}), 1)
  t.is(reduce({color: 'red'}), 'red')
  t.is(reduce({}), '')
  t.end()
})

test('parse complex string', function (t) {
  let str = '{{ color }} 25 {{ number }}'
  let reduce = compileStr(str)
  t.is(reduce({color: 'red', number: 34}), 'red 25 34')
  t.is(reduce({color: 1}), '1 25 ')
  t.end()
})
