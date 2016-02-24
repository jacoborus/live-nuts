'use strict'

import newCounter from './counter.js'

export default function (schemas, store) {
  /**
   * extract data model from html
   *
   * @param {DOMnode} element target element to extract data from
   * @param {object} scope extracted data will be outputted here
   * @param {function} callback simple next function caller
   */
  return function extract (branch, scope, callback) {
    // skip on empty branch
    if (!branch.size) return callback()
    // launch callback after children data is extracted
    let count = newCounter(branch.size, callback)
    branch.forEach((child, el) => {
      let nut = {},
          schema = schemas.get(el.getAttribute('data-nut')),
          scopeAtt = schema.scope,
          events = schema.events,
          innerScope

      nut.element = el

      let preScope
      if (scopeAtt) {
        if (!scope[scopeAtt]) scope[scopeAtt] = {}
        preScope = scope[scopeAtt]
      } else {
        preScope = scope
      }

      if (schema.repeat) {
        let localScope = {}
        if (!preScope[schema.repeat]) {
          preScope[schema.repeat] = []
        }
        preScope[schema.repeat].push(localScope)
        innerScope = preScope[schema.repeat][preScope[schema.repeat].length - 1]
      } else {
        innerScope = preScope
      }

      if (events) {
        Object.keys(schema.events).forEach(i => {
          let box = store.getBox(innerScope)
          el.addEventListener(i, e => schema.events[i](e, nut, box))
        })
      }

      // contains all links where nut is linked
      // When element is dettached unlink all
      let innerLinks = new Set()

      nut.scope = innerScope

      if (schema.booleans) {
        for (let att in schema.booleans) {
          let actionLink = value => {
            if (value[att]) {
              el.setAttribute(att, '')
            } else {
              el.removeAttribute(att)
            }
          }
          innerLinks.add(store.subscribe(innerScope, att, actionLink))
        }
      }

      extract(child, innerScope, count)
    })
  }
}
