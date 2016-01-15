'use strict'

import newCounter from './counter.js'

export default function (schemas, links) {
  function updateScope (scope) {
    if (!links.has(scope)) links.set(scope, new Set())
    let link = links.get(scope)
    return function (modelName, data) {
      scope[modelName] = data
      link.forEach(x => x.updateView())
    }
  }

  function updateModel (scope, nut) {
    if (!links.has(scope)) links.set(scope, new Set())
    let link = links.get(scope)
    link.add(nut)
    return function (data) {
      scope[nut.model] = data
      link.forEach(x => x.updateView())
    }
  }

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
          model = schema.model,
          innerScope

      nut.model = schema.model
      nut.scope = schema.scope
      nut.element = el

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

      nut.updateScope = updateScope(innerScope, nut)
      nut.updateView = function () {
        el.innerHTML = innerScope[model]
      }
      nut.getScope = function (key) {
        if (key) return innerScope[key]
        return innerScope
      }
      if (model) {
        innerScope[model] = el.innerText
        nut.updateModel = updateModel(innerScope, nut)
        return count()
      }
      extract(child, innerScope, count)
    })
  }
}
