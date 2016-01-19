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
        innerScope = localScope
      } else {
        innerScope = preScope
      }

      if (!links.has(innerScope)) links.set(innerScope, new Map())
      let link = links.get(innerScope)

      // constains all links where nut is linked
      // When element is dettached unlink all
      let innerLinks = new Set()

      nut.updateScope = function (modelName, data) {
        innerScope[modelName] = data
        !link.has(modelName) || link.get(modelName).forEach(x => x(data))
        return nut
      }

      nut.updateView = function () {
        el.innerHTML = innerScope[schema.model]
      }

      nut.getScope = function (key) {
        if (key) return innerScope[key]
        return innerScope
      }

      if (schema.booleans) {
        for (let att in schema.booleans) {
          let model = schema.booleans[att]
          let linkModel = link.get(model) || link.set(model, new Set()).get(model)
          let actionLink = value => {
            if (value) {
              el.setAttribute(att, '')
            } else {
              el.removeAttribute(att)
            }
          }
          innerLinks.add(() => linkModel.delete(actionLink))
          linkModel.add(actionLink)
          innerScope[model] = el.getAttribute(model)
        }
      }

      if (schema.nuAtts) {
        for (let att in schema.nuAtts) {
          let model = schema.nuAtts[att]
          let linkModel = link.get(model) || link.set(model, new Set()).get(model)
          let actionLink = value => el.setAttribute(att, value)
          innerLinks.add(() => linkModel.delete(actionLink))
          linkModel.add(actionLink)
          innerScope[model] = el.getAttribute(att)
        }
      }

      if (schema.model) {
        let model = schema.model
        let linkModel = link.get(model) || link.set(model, new Set()).get(model)
        let actionLink = value => el.innerHTML = value
        innerLinks.add(() => linkModel.delete(actionLink))
        linkModel.add(actionLink)
        innerScope[model] = el.innerText
        count()
      } else {
        extract(child, innerScope, count)
      }
    })
  }
}
