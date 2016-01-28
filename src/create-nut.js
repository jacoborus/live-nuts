'use strict'

let links
const forEach = Array.prototype.forEach

export default function (inLinks) {
  links = inLinks
  return function (scope, schema) {
    return schema.isNut ? renderNut(schema, scope) : renderElementDeep(schema, scope)
  }
}

function renderElement (schema) {
  let el = document.createElement(schema.tagName)
  let { attribs, boolAtts } = schema
  if (attribs) forEach.call(attribs, (name, value) => el.setAttribute(name, value))
  if (boolAtts) boolAtts.forEach(name => el.setAttribute(name, ''))
  return el
}

function renderElementDeep (schema, scope) {
  let el = renderElement(schema)
  renderChildren(schema.children, scope).forEach(c => {if (c) el.appendChild(c)})
  return el
}

function renderChildren (children, scope) {
  if (!children || !children.length) return []
  return children.reduce((arr, schema) => {
    if (schema.repeat) {
      arr.concat(scope.map(item => renderNut(schema, item)))
    } else if (schema.isNut) {
      arr.push(renderNut(schema, scope))
    } else {
      arr.push(renderElementDeep(schema, scope))
    }
  }, [])
}

function getScope (scope, schema) {
  let scopeAtt = schema.scope
  if (scopeAtt) {
    if (!scope[scopeAtt]) scope[scopeAtt] = {}
    return scope[scopeAtt]
  } else {
    return scope
  }
}

function renderNut (schema, scope) {
  let nut = {},
      el = renderElement(schema),
      { nuAtts, children, events } = schema

  // add events
  Object.keys(events).forEach(type => el.addEventListener(type, e => events[type](e, nut)))

  let innerScope = getScope(scope, schema)

  if (!links.has(innerScope)) links.set(innerScope, new Map())
  let link = links.get(innerScope)

  // constains all links where nut is linked
  // When element is dettached unlink all
  let innerLinks = new Set()

  if (nuAtts) {
    forEach.call(nuAtts, (model, att) => el.setAttribute(att, innerScope[model]))
  }

  if (schema.booleans) {
    forEach.call(schema.booleans, (model, att) => {
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
      if (innerScope[model]) el.setAttribute(att)
    })
  }

  if (schema.model) {
    el.innerHTML = scope[schema.model]
  } else {
    renderChildren(children, scope).forEach(c => {if (c) el.appendChild(c)})
  }
  return el
}
