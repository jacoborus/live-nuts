'use strict'

const getSource = require('../src/parser.js')
const test = require('tape')

function parser (tmpl, rawChildren) {
  return getSource(document.createRange().createContextualFragment(tmpl).childNodes[0], rawChildren)
}

test('distribute attributes in template', function (t) {
  let tmpl = `<span
    nut="specialNuts"
    class="{{class}}"
    model="model"
    if="if"
    unless="unless"
    repeat="repeat"
    as="nuas"
    (keydown)="presskey"
    (click)="click"
    myatt="myatt">
    hello
    </span>`
  let src = parser(tmpl)

  // class
  t.is(src.localName, 'span')
  t.is(src.attribs.class, '{{class}}')
  // scope
  t.notOk(src.props.model)
  t.is(src.attribs.model, 'model')
  // nuif
  t.is(src.props.if, 'if')
  t.is(src.attribs.if, undefined)
  // unless
  t.is(src.props.unless, 'unless')
  t.is(src.attribs.unless, undefined)
  // repeat
  t.notOk(src.props.repeat)
  t.is(src.attribs.repeat, 'repeat')
  // as
  t.notOk(src.props.as)
  t.is(src.attribs.as, 'nuas')
  // nut keyname
  t.is(src.attribs.nut, undefined)
  t.is(src.tagName, 'specialNuts')
  // regular attributes
  t.is(src.attribs.myatt, 'myatt')
  // events
  t.is(src.events.click, 'click')
  t.is(src.events.keydown, 'presskey')
  t.end()
})

test('distribute attributes in children', function (t) {
  let tmpl = `<span
    nut="specialNuts"
    class="{{class}}"
    model="model"
    if="if"
    unless="unless"
    repeat="repeat"
    as="nuas"
    (keydown)="presskey"
    (click)="click"
    myatt="myatt"><span
      nut="specialNuts"
      class="{{class}}"
      model="model"
      if="if"
      unless="unless"
      repeat="repeat"
      (keydown)="presskey"
      (click)="click"
      myatt="myatt"><span
          nut="specialNuts"
          class="{{class}}"
          model="model"
          if="if"
          unless="unless"
          repeat="repeat"
          as="nuas"
          (keydown)="presskey"
          (click)="click"
          myatt="myatt">hello</span></span><span
      nut="specialNuts"
      class="{{class}}"
      model="model"
      if="if"
      unless="unless"
      repeat="repeat"
      as="nuas"
      (keydown)="presskey"
      (click)="click"
      myatt="myatt">hello</span></span>`

  let src = parser(tmpl).children[0]
  // localname
  t.is(src.localName, 'span', 'localName')
  // class
  t.is(src.attribs.class, '{{class}}', 'class')
  // scope
  t.is(src.props.model, 'model', 'model')
  t.is(src.attribs.model, undefined, 'model')
  // nuif
  t.is(src.props.if, 'if', 'if')
  t.is(src.attribs.if, undefined, 'if')
  // unless
  t.is(src.props.unless, 'unless', 'unless')
  t.is(src.attribs.unless, undefined, 'unless')
  // repeat
  t.is(src.props.repeat, 'repeat', 'repeat')
  t.is(src.attribs.repeat, undefined, 'repeat')
  // nut keyname
  t.is(src.attribs.nut, 'specialNuts', 'keyname')
  t.notOk(src.tagName, 'no tagname in children')
  // regular attributes
  t.is(src.attribs.myatt, 'myatt')
  // events
  t.is(src.events.click, 'click')
  t.is(src.events.keydown, 'presskey')

  // subchild
  let child = parser(tmpl).children[0].children[0]

  // class
  t.is(child.localName, 'span', 'subchild localName')
  t.is(child.attribs.class, '{{class}}')
  // scope
  t.is(child.props.model, 'model')
  t.is(child.attribs.model, undefined)
  // as
  t.is(child.props.as, 'nuas')
  t.notOk(child.attribs.as, 'nuas')
  // nuif
  t.is(child.props.if, 'if')
  t.is(child.attribs.if, undefined)
  // unless
  t.is(child.props.unless, 'unless')
  t.is(child.attribs.unless, undefined)
  // repeat
  t.is(child.props.repeat, 'repeat')
  t.is(child.attribs.repeat, undefined)
  // nut keyname
  t.notOk(child.tagname, 'no tagname in children')
  t.is(child.attribs.nut, 'specialNuts', 'no tagname in children')
  // regular attributes
  t.is(child.attribs.myatt, 'myatt')
  // events
  t.is(child.events.click, 'click')
  t.is(child.events.keydown, 'presskey')

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

test('omit children when tag has `as` attribute', function (t) {
  let tmpl = '<ul nut="simpleTag"><li as="nuas">hola<span></span></li></ul>',
      src = parser(tmpl).children[0]

  t.notOk(src.children)
  t.end()
})
