'use strict'

import test from 'tape'

import { createStore, subscribe } from '../src/store-factory.js'

let globalModel = {
  title: 'super title',
  object: {
    prop1: 1,
    prop2: 2,
    po: {
      a: 1,
      b: 2
    }
  },
  loop: [{
    title: 'A lorem title',
    entry: 'entry lorem ipsum'
  }, {
    title: 'Two lorem titles',
    entry: 'two entry lorem ipsum'
  }],
  anotherObj: {},
  anotherLoop: []
}
window.globalModel = globalModel

test('create store from object with children', function (t) {
  let store = createStore(globalModel)
  t.is(store.title, globalModel.title, 'assign prop')
  t.is(store.object.prop2, globalModel.object.prop2, 'assign prop inside obj')
  t.is(store.loop[0].title, globalModel.loop[0].title, 'assign prop inside array')
  t.is(store.loop[1].entry, globalModel.loop[1].entry, 'assign prop inside array')
  let control = 0
  let unsubscribe = subscribe(store, 'title', value => control = value)
  store.title = 'uno'
  t.is(control, 'uno', 'subscribe change')
  delete store.title
  t.is(control, undefined, 'subscribe delete')
  subscribe(store.object, 'prop1', value => control = value)
  store.object.prop1 = 'uno'
  t.is(control, 'uno', 'subscribe object properties to change')
  unsubscribe()
  store.title = 'dos'
  t.is(control, 'uno', 'unsubscribe')
  t.end()
})
