'use strict'

import newCounter from './counter.js'

export default function (schemas, links) {
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
          schema = schemas.get(el.getAttribute('is')),
          scopeAtt = schema.scope,
          innerScope

      nut.element = el
      nut.schema = schema

      for (let i in schema.events) {
        el.addEventListener(i, function (event) {
          schema.events[i](event, nut)
        })
      }

      if (scopeAtt) {
        if (!scope[scopeAtt]) scope[scopeAtt] = {}
        innerScope = scope[scopeAtt]
      } else {
        innerScope = scope
      }

      if (!links.has(innerScope)) links.set(innerScope, new Set())
      let link = links.get(innerScope)

      nut.updateScope = function (modelName, data) {
        innerScope[modelName] = data
        link.forEach(x => x.updateView())
      }

      nut.updateView = function () {
        el.innerHTML = innerScope[schema.model]
      }

      nut.getScope = function (key) {
        if (key) return innerScope[key]
        return innerScope
      }

      if (schema.model) {
        link.add(nut)
        innerScope[schema.model] = el.innerText
        nut.updateModel = function (data) {
          innerScope[schema.model] = data
          link.forEach(x => x.updateView())
        }
        count()
      } else {
        extract(child, innerScope, count)
      }
    })
  }
}
