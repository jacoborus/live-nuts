'use strict'

import test from 'tape'

import storeFactory from '../src/store-factory.js'

let globalModel = {
  title: 'super title',
  object: {
    prop1: 1,
    prop2: 2
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
  let links = new Map()
  let createStore = storeFactory(links)
  let store = createStore(globalModel)
  t.is(store.title, globalModel.title)
  t.is(store.object.prop2, globalModel.object.prop2)
  t.is(store.loop[0].title, globalModel.loop[0].title)
  t.is(store.loop[1].entry, globalModel.loop[1].entry)
  t.is(links.size, 7)
  t.end()
})
