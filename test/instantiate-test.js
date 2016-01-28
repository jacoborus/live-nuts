'use strict'

import test from 'tape'
import registerTree from '../src/register-tree.js'
import instantiator from '../src/instantiate.js'
import getProxyFactory from '../src/get-proxy.js'

test('instantiate tree with scope', function (t) {
  let links = new Map()
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
        if (nut.scope.funciona === 'hola') {
          nut.scope.funciona = 'adios'
        } else {
          nut.scope.funciona = 'hola'
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
  let getProxy = getProxyFactory(links)
  let testScope = getProxy({})

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
  let schemas = new Map()
  let getProxy = getProxyFactory(links)

  schemas.set('x-li', {
    localName: 'li',
    tagName: 'x-li',
    repeat: 'items',
    model: 'number',
    scope: 'list',
    events: {
      click: function (event, nut) {
        let model = nut.schema.model
        let n = Number(nut.scope[model])
        nut.scope.number = ++n
      }
    }
  })
  schemas.set('x-ul', {
    localName: 'ul',
    tagName: 'x-ul'
  })

  let element = document.createElement('div')
  element.innerHTML = `<ul is="x-ul">
    <li id="xli1" is="x-li" test="test1">uno</li>
    <li is="x-li" test="test2">dos</li>
  </ul>`

  let instantiate = instantiator(schemas, links)
  let testScope = getProxy({})

  registerTree(element, schemas)
  .then(tree => {
    instantiate(tree, testScope, () => {
      t.ok(testScope.list)
      t.ok(Array.isArray(testScope.list.items))
      t.is(testScope.list.items.length, 2)
      t.is(testScope.list.items[0].number, 'uno') // fail
      t.is(testScope.list.items[1].number, 'dos') // fail
      let bar = element.querySelector('#xli1')
      bar.click()
      document.body.removeChild(element)
      t.end()
    })
  })
  document.body.appendChild(element)
})
