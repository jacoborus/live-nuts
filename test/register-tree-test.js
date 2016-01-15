'use strict'
// document.children[0]

import test from 'tape'
import registerTree from '../src/register-tree.js'

test('register nuts as custom elements', function (t) {
  let schemas = new Map()
  schemas.set('x-foo', {
    extends: 'li',
    tagName: 'x-foo'
  })
  schemas.set('x-fa', {
    extends: 'span',
    tagName: 'x-fa'
  })

  let element = document.createElement('div')
  element.innerHTML = `<div>
    <strong>hola</strong>
    <li is="x-foo" id="xfoo1" test="test">
      <div>
        <span is="x-fa" id="xfa1">it works!</span>
      </div>
    </li>
  </div>`

  registerTree(element, schemas)
  .then(tree => {
    let xfoo1 = element.querySelector('#xfoo1')
    let xfa = element.querySelector('#xfa1')
    // let xfooX = xfoo1.getAttribute('test')
    t.ok(tree.has(xfoo1))
    t.ok(tree.get(xfoo1).has(xfa))
    t.is(xfoo1.getAttribute('test'), 'test')
    document.body.removeChild(element)
    t.end()
  })
  document.body.appendChild(element)
})
