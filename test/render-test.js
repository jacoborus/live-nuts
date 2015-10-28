'use strict'

import test from 'tape'
import render from '../src/render.js'

test('render simplest tag', function (t) {
  let scope = {}
  let nut = {
    key: 'testKey',
    type: 'tag',
    name: 'span'
  }
  let instance = render(nut, scope)
  t.is(instance.element.localName, 'span')
  t.end()
})

test('render simplest tag with model', function (t) {
  let scope = {
    testModel: 'testing'
  }
  let nut = {
    key: 'testKey',
    type: 'tag',
    name: 'span',
    model: 'testModel'
  }
  let instance = render(nut, scope)
  t.is(instance.element.localName, 'span')
  t.is(instance.element.innerText, 'testing')
  t.end()
})

test('add bindings to rendered elements', t => {
  let control = false
  let nut = {
    key: 'testKey',
    type: 'tag',
    name: 'span',
    model: 'testModel',
    bindings: {
      click: function () {
        control = true
      }
    }
  }
  let element = render(nut, {}).element
  element.click()
  t.is(control, true)
  t.end()
})

// test('updates value when model changes', function (t) {
//   let scope = {
//     testModel: 'testing'
//   }
//   let nut = {
//     key: 'testKey',
//     type: 'tag',
//     name: 'span',
//     model: 'testModel'
//   }
//   let instance = render(nut, scope)
//   t.is(instance.element.localName, 'span')
//   t.is(instance.element.innerText, 'testing')
//   instance.update({testModel: 'passed'})
//   t.is(instance.element.innerText, 'passed')
//   t.end()
// })
