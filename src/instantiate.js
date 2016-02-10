'use strict'

import newCounter from './counter.js'

export default function (schemas, subscribe) {
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
          innerScope

      nut.element = el
      nut.schema = schema

      for (let i in schema.events) {
        el.addEventListener(i, function (event) {
          schema.events[i](event, nut)
        })
      }

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

      // constains all links where nut is linked
      // When element is dettached unlink all
      let innerLinks = new Set()

      nut.scope = innerScope

      if (schema.booleans) {
        for (let att in schema.booleans) {
          let model = schema.booleans[att]
          let actionLink = value => {
            if (value) {
              el.setAttribute(att, '')
            } else {
              el.removeAttribute(att)
            }
          }
          innerLinks.add(subscribe(innerScope, model, actionLink))
        }
      }

      if (schema.nuAtts) {
        for (let att in schema.nuAtts) {
          let model = schema.nuAtts[att]
          innerScope[model] = el.getAttribute(att)
          let actionLink = value => el.setAttribute(att, value)
          innerLinks.add(subscribe(innerScope, model, actionLink))
        }
      }

      if (schema.model) {
        let model = schema.model
        let actionLink = value => el.innerHTML = value
        innerLinks.add(subscribe(innerScope, model, actionLink))
        innerScope[model] = el.innerText
        count()
      } else {
        extract(child, innerScope, count)
      }
    })
  }
}
