'use strict'

import newCounter from './counter.js'
import registerNut from './register-nut.js'

let forEach = Array.prototype.forEach

export default function (element, schemas) {
  return new Promise(resolve => {
    let total = 0
    Array.prototype.forEach.call(element.querySelectorAll('[is]'), x => {
      if (schemas.has(x.getAttribute('is'))) {
        x.isNut = true
        total++
      }
    })

    let nutsTree = new Map()
    let registerCount = newCounter(schemas.size, () => {
      makeTree(element, nutsTree)
    })
    let treeCounter = newCounter(total, () => {
      resolve(nutsTree)
    })

    if (schemas.size) {
      schemas.forEach(schema => {
        registerNut(schema, registerCount)
      })
    } else {
      resolve(nutsTree)
    }

    function makeTree (el, tree) {
      let branch = el.isNut ? tree.set(el, new Map()).get(el) : tree
      if (el.childElementCount) {
        forEach.call(el.children, child => makeTree(child, branch))
      }
      if (el.isNut) treeCounter()
    }
  })
}

