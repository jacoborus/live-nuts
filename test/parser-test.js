'use strict'

import getSource from '../src/parser.js'
import test from 'tape'

function parser (tmpl, rawChildren) {
  return getSource(document.createRange().createContextualFragment(tmpl).childNodes[0], rawChildren)
}

test('distribute attributes', function (t) {
  let tmpl = '<span ' +
        ' nut="specialNuts"' +
        ' class="{{class}}"' +
        // scopes
        ' model="model"' +
        // conditionals
        ' if="if"' +
        ' unless="unless"' +
        // iterations
        ' repeat="repeat"' +
        // layouts
        ' as="nuas"' +
        // regular attributes
        ' myatt="myatt"' +
        // variable attribute
        '>' +
        'hello' +
        '</span>',
      src = parser(tmpl)

  // class
  t.is(src.localName, 'span')
  t.is(src.attribs.class, '{{class}}')
  // scope
  t.is(src.model, 'model')
  t.is(src.attribs.model, undefined)
  // nuif
  t.is(src.if, 'if')
  t.is(src.attribs.if, undefined)
  // unless
  t.is(src.unless, 'unless')
  t.is(src.attribs.unless, undefined)
  // repeat
  t.is(src.repeat, 'repeat')
  t.is(src.attribs.repeat, undefined)
  // as
  t.is(src.as, 'nuas')
  t.is(src.attribs.as, undefined)
  // nut keyname
  t.is(src.attribs.nut, undefined)
  t.is(src.tagName, 'specialNuts')
  // regular attributes
  t.is(src.attribs.myatt, 'myatt')
  t.end()
})

test('parse child elements', function (t) {
  let tmpl = '<ul nut="simpleTag"><li>hola<span></span></li></ul>',
      src = parser(tmpl)

  t.is(src.children[0].type, 1)
  t.is(src.children[0].localName, 'li')
  t.is(src.children[0].children[0].type, 3)
  t.is(src.children[0].children[1].type, 1)
  t.is(src.children[0].children[1].localName, 'span')
  t.end()
})

test('parse just parent element and send children as raw', function (t) {
  let tmpl = '<ul nut="simpleTag"><li>hola<span></span></li></ul>',
      src = parser(tmpl, true)

  t.notOk(src.children[0].model)
  t.end()
})
