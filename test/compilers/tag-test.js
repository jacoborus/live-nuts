'use strict'

import compileTag from '../../src/compilers/tag.js'
import test from 'tape'
import boxes from 'boxes'

test('compile simple tag', function (t) {
  let scope = {}
  let box = boxes(scope)
  let schema = {
    type: 1,
    tagName: 'span',
    attribs: {
      alt: 'alternative'
    }
  }
  compileTag(schema, null, () => {
    let el = schema.render(scope, box, null)
    t.is(el.getAttribute('alt'), 'alternative')
    t.end()
  })
})
