'use strict'

import newCounter from './counter.js'

let forEach = Array.prototype.forEach

// create a tree of maps with nut elements as map keys inside a provided DOM element
export default function (element, schemas) {
  return new Promise(resolve => {
    let total = 0
    Array.prototype.forEach.call(element.querySelectorAll('[data-nut]'), x => {
      if (schemas.has(x.getAttribute('data-nut'))) {
        x.isNut = true
        total++
      }
    })

    let nutsTree = new Map()
    if (!total) {
      return resolve(nutsTree)
    }

    let treeCounter = newCounter(total, () => resolve(nutsTree))
    makeTree(element, nutsTree)

    function makeTree (el, tree) {
      let branch = el.isNut ? tree.set(el, new Map()).get(el) : tree
      if (el.childElementCount) {
        forEach.call(el.children, child => makeTree(child, branch))
      }
      if (el.isNut) treeCounter()
    }
  })
}
