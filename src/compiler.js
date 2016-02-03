'use strict'

import newCounter from './counter.js'

let links
const matcher = /{{([^}]*)}}/

function getScope (scope, scopeAtt) {
  if (scopeAtt) {
    if (!scope[scopeAtt]) scope[scopeAtt] = {}
    return scope[scopeAtt]
  } else {
    return scope
  }
}

function parseStr (str) {
  if (!str) {
    return {
      fns: [],
      models: []
    }
  }
  let st = str.match(matcher)
  if (st.index) {
    let out = str.substr(0, st.index)
    let next = parseStr(str.substring(st.index))
    return {
      fns: [() => out].concat(next.fns),
      models: [].concat(next.models)
    }
  } else {
    let model = st[1].trim()
    let next = parseStr(str.substring(st[0].length))
    return {
      fns: [scope => scope[model] || ''].concat(next.fns),
      models: [model].concat(next.models)
    }
  }
}

function compileAttributes (atts) { // compile attributes
  let fns = []
  for (let att in atts) {
    let value = atts[att]
    if (value.match(matcher)) {
      let loop = parseStr(value)
      fns.push(function (el, scope) {
        el.setAttribute(att, loop.fns.reduce((str, fn) => str + fn(scope), ''))
      })
    } else {
      fns.push(el => el.setAttribute(att, value))
    }
  }
  return (el, scope) => fns.forEach(fn => fn(el, scope))
}

function compileText (schema, callback) {
  let data = schema.data
  if (schema.data.match(matcher)) {
    let loop = parseStr(schema.data)
    // let models = new Set()
    if (loop.fns.length === 1) {
      let fn = loop.fns[0]
      schema.render = scope => {
        let el = document.createTextNode(fn(scope))
        let updateFn = value => el.textContent = value
        loop.models.forEach(model => links.get(scope).get(model).add(updateFn))
        return el
      }
    } else {
      schema.render = function (scope) {
        let el = document.createTextNode(loop.fns.reduce((str, fn) => str + fn(scope), ''))
        let updateFn = () => el.textContent = loop.fns.reduce((str, fn) => str + fn(scope), '')
        loop.models.forEach(model => links.get(scope).get(model).add(updateFn))
        return el
      }
    }
  } else {
    schema.render = () => document.createTextNode(data)
  }
  callback()
}

function compileTag (schema, callback) {
  let { events, children, attribs } = schema
  let renderAttributes
  if (attribs) {
    renderAttributes = compileAttributes(attribs)
  }
  schema.render = (outerScope) => {
    let scope = getScope(outerScope, schema.scope),
        el = document.createElement(schema.localName),
        nut = { el, scope }
    // let link = links.get(scope)
    // let linkModel = link.get(model) || link.set(model, new Set()).get(model)
    // render attributes
    if (attribs) renderAttributes(el, scope)
    // add events
    if (events) {
      Object.keys(events).forEach(type => el.addEventListener(type, e => events[type](e, nut)))
    }
    // render children
    if (schema.children) {
      schema.children.forEach(c => el.appendChild(c.render(scope)))
    }
    return el
  }
  // compile children
  if (children && children.length) {
    let count = newCounter(children.length, callback)
    children.forEach(c => compile(c, count))
  } else {
    callback()
  }
}

function compile (schema, callback) {
  if (schema.type === 1) {
    compileTag(schema, callback)
  } else if (schema.type === 3) {
    compileText(schema, callback)
  }
}

export default function (inLinks) {
  links = inLinks
  return compile
}
