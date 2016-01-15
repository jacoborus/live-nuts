'use strict'

import test from 'tape'

import registerTree from '../src/register-tree.js'
import instantiator from '../src/instantiate.js'

test('instantiate tree with scope', function (t) {
  let links = new Map()
  let testScope = {}
  let schemas = new Map()
  schemas.set('x-bor', {
    extends: 'li',
    tagName: 'x-bor',
    scope: 'saludo'
  })
  schemas.set('x-bar', {
    extends: 'span',
    tagName: 'x-bar',
    model: 'funciona',
    events: {
      click: function (event, nut) {
        if (nut.getScope()[nut.model] === 'hola') {
          nut.updateModel('adios')
        } else {
          nut.updateModel('hola')
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
      t.end()
    })
  })
  document.body.appendChild(element)
})
