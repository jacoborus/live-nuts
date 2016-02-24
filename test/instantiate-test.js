'use strict'

import test from 'tape'
import registerTree from '../src/register-tree.js'
import instantiator from '../src/instantiate.js'
import boxes from 'boxes'

test('instantiate tree with scope', function (t) {
  let schemas = new Map()

  schemas.set('x-bor', {
    localName: 'li',
    tagName: 'x-bor',
    scope: 'saludo'
  })
  schemas.set('x-bar', {
    localName: 'span',
    tagName: 'x-bar',
    events: {
      click: function (event, nut, box) {
        if (box.get().funciona === 'hola') {
          box.set('funciona', 'adios')
        } else {
          box.set('funciona', 'hola')
        }
      }
    }
  })

  let element = document.createElement('div')
  element.innerHTML = `<div>
    <strong>hola</strong>
    <li data-nut="x-bor" id="xfoo1" test="test">
      <div>
        <span data-nut="x-bar" id="xfa1">hola</span>
      </div>
    </li>
  </div>`

  let store = boxes.createStore('instantiate', {})
  let instantiate = instantiator(schemas, store)

  registerTree(element, schemas)
  .then(tree => {
    instantiate(tree, store.get(), () => {
      let bar = element.querySelector('#xfa1')
      t.ok(store.get().saludo)
      bar.click()
      t.is(store.get().saludo.funciona, 'hola')
      bar.click()
      t.is(store.get().saludo.funciona, 'adios')
      document.body.removeChild(element)
      boxes.remove('instantiate')
      t.end()
    })
  })
  document.body.appendChild(element)
})

test('instantiate tree with array', function (t) {
  let schemas = new Map()

  schemas.set('x-li', {
    localName: 'li',
    tagName: 'x-li',
    repeat: 'items',
    scope: 'list',
    events: {
      click: function (event, nut, box) {
        let n = Number(box.get().number)
        box.set('number', ++n)
      }
    }
  })
  schemas.set('x-ul', {
    localName: 'ul',
    tagName: 'x-ul'
  })

  let element = document.createElement('div')
  element.innerHTML = `<ul data-nut="x-ul">
    <li id="xli1" data-nut="x-li" test="test1">uno</li>
    <li data-nut="x-li" test="test2">dos</li>
  </ul>`

  let store = boxes.createStore('instantiateTree', {})
  let instantiate = instantiator(schemas, store)

  registerTree(element, schemas)
  .then(tree => {
    instantiate(tree, store.get(), () => {
      t.ok(store.get().list)
      t.ok(Array.isArray(store.get().list.items))
      t.is(store.get().list.items.length, 2)
      t.ok(store.get().list.items[0]) // fail
      t.ok(store.get().list.items[1]) // fail
      let bar = element.querySelector('#xli1')
      bar.click()
      document.body.removeChild(element)
      boxes.remove('instantiateTree')
      t.end()
    })
  })
  document.body.appendChild(element)
})
