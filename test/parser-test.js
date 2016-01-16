'use strict'

import getSource from '../src/parser.js'
import test from 'tape'

function parser (tmpl, rawChildren) {
  return getSource(document.createRange().createContextualFragment(tmpl).childNodes[0], rawChildren)
}

test('generate a source from template string', function (t) {
  let tmpl = '<span nut="simpleTag"></span>',
      src = parser(tmpl)

  t.is(src.type, 'tag')
  t.is(src.localName, 'span')
  t.end()
})

test('separate nuts attributes from regular ones', function (t) {
  let src = parser('<span id="id" nu-att="nuid" nut="separateAtts">hello</span>')
  t.is(src.attribs.id, 'id')
  t.is(src.nuAtts.att, 'nuid')
  t.end()
})

test('distribute special nuts attributes', function (t) {
  let tmpl = '<span ' +
        ' nut="list"' +
        ' class="class"' +
        ' nu-class="nuclass"' +
        // scopes
        ' nu-scope="scope"' +
        ' nu-model="model"' +
        // conditionals
        ' nu-if="if"' +
        ' nu-unless="unless"' +
        // iterations
        ' nu-repeat="repeat"' +
        ' nu-each="each"' +
        // layouts
        ' nu-layout="layout"' +
        ' nu-block="head"' +
        ' nu-extend="extend"' +
        ' nu-as="nuas"' +
        ' nut="specialNuts"' +
        // regular attributes
        ' myatt="myatt"' +
        ' custom="custom"' +
        // variable attribute
        ' nu-custom="custom"' +
        '>' +
        'hello' +
        '</span>',
      src = parser(tmpl)

  // class
  t.is(src.localName, 'span')
  t.is(src.class, 'class')
  t.is(src.nuAtts.class, undefined)
  // nuClass
  t.is(src.nuClass, 'nuclass')
  // scope
  t.is(src.scope, 'scope')
  t.is(src.nuAtts.scope, undefined)
  // model
  t.is(src.model, 'model')
  t.is(src.nuAtts.model, undefined)
  // nuif
  t.is(src.nuif, 'if')
  t.is(src.nuAtts.nuif, undefined)
  // unless
  t.is(src.unless, 'unless')
  t.is(src.nuAtts.unless, undefined)
  // repeat
  t.is(src.repeat, 'repeat')
  t.is(src.nuAtts.repeat, undefined)
  // each
  t.is(src.each, 'each')
  t.is(src.nuAtts.each, undefined)
  // as
  t.is(src.as, 'nuas')
  t.is(src.nuAtts.as, undefined)
  // nut keyname
  t.is(src.nuAtts.nut, undefined)
  t.is(src.keyname, 'list')
  // regular attributes
  t.is(src.attribs.myatt, 'myatt')
  t.is(src.attribs.custom, 'custom')
  // variable attributes
  t.is(src.nuAtts.custom, 'custom')
  t.end()
})

test('add boolean attributes to schema', function (t) {
  let tmpl = '<span nut="booleans" nu-bool-="myboolean">hello</span>',
      src = parser(tmpl)
  t.is(src.booleans.bool, 'myboolean')
  t.end()
})

test('detect void elements', function (t) {
  let tmpl = '<input nut="voidelem">',
      src = parser(tmpl)
  t.is(src.voidElement, true)
  t.end()
})

test('detect formatters', function (t) {
  let tmpl = '<input nut="formatTag" nu-model=" model | format | other ">',
      src = parser(tmpl)
  t.is(src.formatters[0], 'format')
  t.is(src.formatters[1], 'other')
  t.end()
})

test('parse child elements', function (t) {
  let tmpl = '<ul nut="simpleTag"><li>hola<span></span></li></ul>',
      src = parser(tmpl)

  t.is(src.children[0].type, 'tag')
  t.is(src.children[0].localName, 'li')
  t.is(src.children[0].children[0].type, 'text')
  t.is(src.children[0].children[1].type, 'tag')
  t.is(src.children[0].children[1].localName, 'span')
  t.end()
})

test('parse just parent element and send children as raw', function (t) {
  let tmpl = '<ul nut="simpleTag"><li nu-model="sample">hola<span></span></li></ul>',
      src = parser(tmpl, true)

  t.notOk(src.children[0].model)
  t.end()
})
