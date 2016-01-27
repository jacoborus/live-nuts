'use strict'

import test from 'tape'

import getProxyFactory from '../src/get-proxy.js'

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

test('create proxy from object with children', function (t) {
  let links = new Map()
  let getProxy = getProxyFactory(links)
  let p = getProxy(globalModel)
  window.p = p
  window.links = links
  t.is(p.title, globalModel.title)
  t.is(p.object.prop2, globalModel.object.prop2)
  t.is(p.loop[0].title, globalModel.loop[0].title)
  t.is(p.loop[1].entry, globalModel.loop[1].entry)
  t.is(links.size, 7)
  t.end()
})
