'use strict'

const compileTag = require('../../src/compilers/tag.js')
const test = require('tape')
const emitter = require('arbitrary-emitter')()
const compile = require('../../src/compiler.js')

test('compile simple tag with attributes', function (t) {
  let scope = {
    other: 'another'
  }
  let control = 1
  let schema = {
    type: 1,
    localName: 'span',
    tagName: 'superspan',
    attribs: {
      alt: 'alternative',
      other: '{{ other }}'
    },
    events: {
      click: 'makeclick'
    },
    methods: {
      makeclick (e, nut) {
        e.target.test = 'test'
        nut.changeControl(99)
        nut.scope.other = 'changed!'
        nut.emit(nut.scope)
      },
      changeControl (x) {
        control = x
      }
    }
  }
  compileTag(schema, compile)
  let el = schema.render(scope, emitter, null)
  t.is(el.getAttribute('alt'), 'alternative', 'render regular attributes')
  t.is(el.getAttribute('other'), 'another', 'render scoped attributes')
  el.click()
  t.is(el.test, 'test', 'bind events')
  t.is(control, 99, 'events can call other methods')
  t.is(el.getAttribute('other'), 'changed!', 'update element attributes on save')
  t.end()
})

test('compile simple tag with no scoped children', function (t) {
  let scope = {}
  let schema = {
    type: 1,
    tagName: 'test',
    localName: 'span',
    children: [{
      type: 3,
      data: 'hola'
    }, {
      type: 1,
      localName: 'span'
    }]
  }
  compileTag(schema, compile)
  let el = schema.render(scope, emitter)
  t.is(el.textContent, 'hola', 'render simple text child')
  t.is(el.childNodes[1].localName, 'span')
  t.end()
})

test('compile tag with scoped children', function (t) {
  let scope = {
    saludo: 'hello',
    alt: 'alternative',
    booleano: true
  }
  let schema = {
    type: 1,
    tagName: 'test',
    localName: 'span',
    methods: {
      addOne (e, nut) {
        let scope = nut.scope
        scope.saludo = scope.saludo + '1'
        scope.alt = scope.alt + '1'
        scope.booleano = !scope.booleano
        nut.emit(scope)
      }
    },
    children: [{
      type: 3,
      data: '{{ saludo }}'
    }, {
      type: 1,
      localName: 'span',
      attribs: {
        title: 'title',
        alt: '{{ alt }}',
        'bool-': 'booleano'
      },
      events: {
        click: 'addOne'
      }
    }]
  }
  compileTag(schema, compile)
  let el = schema.render(scope, emitter)
  t.is(el.textContent, 'hello', 'render simple text child')
  t.is(el.childNodes[1].localName, 'span')
  t.is(el.childNodes[1].getAttribute('alt'), 'alternative')
  t.ok(el.childNodes[1].hasAttribute('bool'), 'booleans')
  el.childNodes[1].click()
  t.is(el.textContent, 'hello1', 'render simple text child')
  t.is(el.childNodes[1].getAttribute('alt'), 'alternative1')
  t.notOk(el.childNodes[1].hasAttribute('bool'), 'booleans')
  el.childNodes[1].click()
  t.is(el.textContent, 'hello11', 'render simple text child')
  t.is(el.childNodes[1].getAttribute('alt'), 'alternative11')
  t.ok(el.childNodes[1].hasAttribute('bool'), 'booleans')
  t.end()
})

test('compile schrodinger children "model"', function (t) {
  let scope = {
  }
  let schema = {
    type: 1,
    tagName: 'test',
    localName: 'p',
    methods: {
      toggleModel (e, nut) {
        let scope = nut.scope
        if (scope.mod) {
          delete scope.mod
        } else {
          scope.mod = {}
        }
        nut.emit(scope)
      }
    },
    children: [{
      type: 1,
      localName: 'span',
      events: {
        click: 'toggleModel'
      }
    }, {
      type: 1,
      localName: 'strong',
      model: 'mod'
    }]
  }
  compileTag(schema, compile)
  let el = schema.render(scope, emitter)
  t.is(el.childNodes[0].localName, 'span', 'first render')
  t.notOk(el.childNodes[1], 'first render')
  el.childNodes[0].click()
  t.is(el.childNodes[0].localName, 'span', 'after update')
  t.is(el.childNodes[1].localName, 'strong', 'after update')
  el.childNodes[0].click()
  t.is(el.childNodes[0].localName, 'span')
  t.notOk(el.childNodes[1])
  t.end()
})

test('compile schrodinger children "whether" and "if"', function (t) {
  let scope = {
    i: true
  }
  let schema = {
    type: 1,
    tagName: 'test',
    localName: 'p',
    methods: {
      toggleWhether (e, nut) {
        let scope = nut.scope
        scope.w = !scope.w
        scope.i = !scope.i
        nut.emit(scope)
      }
    },
    children: [{
      type: 1,
      localName: 'span',
      events: {
        click: 'toggleWhether'
      }
    }, {
      type: 1,
      localName: 'strong',
      whether: 'w'
    }, {
      type: 1,
      localName: 'li',
      if: 'i'
    }]
  }
  compileTag(schema, compile)
  let el = schema.render(scope, emitter)
  t.is(el.childNodes[0].localName, 'span', 'first render')
  t.is(el.childNodes[1].localName, 'li', 'first render')
  t.notOk(el.childNodes[2], 'first render')

  el.childNodes[0].click()
  t.is(el.childNodes[0].localName, 'span', 'after update')
  t.is(el.childNodes[1].localName, 'strong', 'after update')
  t.notOk(el.childNodes[2], 'first render')

  el.childNodes[0].click()
  t.is(el.childNodes[0].localName, 'span')
  t.is(el.childNodes[1].localName, 'li', 'first render')
  t.notOk(el.childNodes[2], 'first render')
  t.end()
})

test('compile schrodinger children "model" and "if"', function (t) {
  let scope = {
  }
  let schema = {
    type: 1,
    tagName: 'test',
    localName: 'p',
    methods: {
      changeScope (e, nut) {
        let scope = nut.scope
        if (!scope.m) {
          scope.m = {}
          nut.emit(scope)
        } else {
          scope.m.i = !scope.m.i
          // nut.emit(scope.m)
          nut.emit(scope)
        }
      }
    },
    children: [{
      type: 1,
      localName: 'span',
      events: {
        click: 'changeScope'
      }
    }, {
      type: 1,
      localName: 'strong',
      model: 'm'
    }, {
      type: 1,
      localName: 'li',
      model: 'm',
      if: 'i'
    }]
  }
  compileTag(schema, compile)
  let el = schema.render(scope, emitter)
  t.is(el.childNodes[0].localName, 'span', 'first render')
  t.notOk(el.childNodes[1], 'first render')
  t.notOk(el.childNodes[2], 'first render')

  el.childNodes[0].click()
  t.is(el.childNodes[0].localName, 'span', 'after update')
  t.is(el.childNodes[1].localName, 'strong', 'after update')
  t.notOk(el.childNodes[2], 'first render')

  el.childNodes[0].click()
  t.is(el.childNodes[0].localName, 'span')
  t.is(el.childNodes[1].localName, 'strong', 'first render')
  t.is(el.childNodes[2].localName, 'li', 'first render')
  t.end()
})
