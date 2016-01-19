'use strict'

import test from 'tape'

import registerTree from '../src/register-tree.js'
import instantiator from '../src/instantiate.js'

test('instantiate tree with scope', function (t) {
  let links = new Map()
  let testScope = {}
  let schemas = new Map()
  schemas.set('x-bor', {
    localName: 'li',
    tagName: 'x-bor',
    scope: 'saludo'
  })
  schemas.set('x-bar', {
    localName: 'span',
    tagName: 'x-bar',
    model: 'funciona',
    events: {
      click: function (event, nut) {
        if (nut.getScope()[nut.schema.model] === 'hola') {
          nut.updateScope('funciona', 'adios')
        } else {
          nut.updateScope('funciona', 'hola')
        }
      }
    }
  })
  let element = document.createElement('div')
  element.innerHTML = `<div>
    <strong>hola</strong>
    <li is="x-bor" id="xfoo1" test="test">
      <div>
        <span is="x-bar" id="xfa1">hola</span>
      </div>
    </li>
  </div>`
  let instantiate = instantiator(schemas, links)

  registerTree(element, schemas)
  .then(tree => {
    instantiate(tree, testScope, () => {
      let bar = element.querySelector('#xfa1')
      t.ok(testScope.saludo)
      t.is(testScope.saludo.funciona, 'hola')
      bar.click()
      t.is(testScope.saludo.funciona, 'adios')
      document.body.removeChild(element)
      t.end()
    })
  })
  document.body.appendChild(element)
})

test('instantiate tree with array', function (t) {
  let links = new Map()
  let testScope = {}
  let schemas = new Map()
  schemas.set('x-li', {
    localName: 'li',
    tagName: 'x-li',
    repeat: 'items',
    model: 'number',
    scope: 'list',
    events: {
      click: function (event, nut) {
        let model = nut.schema.model
        let n = Number(nut.getScope(model))
        nut
        .updateScope(model, ++n)
      }
    }
  })
  schemas.set('x-ul', {
    localName: 'ul',
    tagName: 'x-ul'
  })
  let element = document.createElement('div')
  element.innerHTML = `<ul is="x-ul">
    <li id="xli1" is="x-li" test="test1">1</li>
    <li is="x-li" test="test2">2</li>
  </ul>`
  let instantiate = instantiator(schemas, links)

  registerTree(element, schemas)
  .then(tree => {
    instantiate(tree, testScope, () => {
      t.ok(testScope.list)
      t.ok(Array.isArray(testScope.list.items))
      t.is(testScope.list.items[0].number, '1')
      t.is(testScope.list.items[1].number, '2')
      let bar = element.querySelector('#xli1')
      bar.click()
      t.is(testScope.list.items[0].number, 2)
      document.body.removeChild(element)
      console.log(testScope)
      t.end()
    })
  })
  document.body.appendChild(element)
})
