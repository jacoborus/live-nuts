'use strict'

import newCounter from './counter.js'

let links
const matcher = /{{([^}]*)}}/

function getSubscriber (obj) {
  let link = links.get(obj)
  return function (prop, action) {
    link.get(prop).add(action)
  }
}

function getScope (scope, scopeAtt, subscribe) {
  if (scopeAtt) {
    if (!scope[scopeAtt]) {
      scope[scopeAtt] = {}
    }
    let newScope = scope[scopeAtt]
    return {
      scope: newScope,
      subscribe: getSubscriber(newScope)
    }
  } else {
    return { scope, subscribe }
  }
}

function parseStr (str) {
  if (!str) {
    return {
      fns: [],
      models: new Set()
    }
  }
  let st = str.match(matcher)
  if (st.index) {
    let out = str.substr(0, st.index)
    let next = parseStr(str.substring(st.index))
    return {
      fns: [() => out].concat(next.fns),
      models: next.models
    }
  } else {
    let model = st[1].trim()
    let next = parseStr(str.substring(st[0].length))
    return {
      fns: [scope => scope[model] || ''].concat(next.fns),
      models: next.models.add(model)
    }
  }
}

function compileAttributes (atts) { // compile attributes
  let fns = []
  for (let name in atts) {
    let value = atts[name]
    if (value.match(matcher)) {
      let loop = parseStr(value)
      fns.push(function (el, scope, subscribe) {
        let updateFn = () => {
          el.setAttribute(name, loop.fns.reduce((str, fn) => str + fn(scope), ''))
        }
        loop.models.forEach(model => subscribe(model, updateFn))
        updateFn()
      })
    } else {
      fns.push(el => el.setAttribute(name, value))
    }
  }
  return (el, scope, subscribe) => fns.forEach(fn => fn(el, scope, subscribe))
}

function compileText (schema, callback) {
  let data = schema.data
  if (schema.data.match(matcher)) {
    let loop = parseStr(schema.data)
    if (loop.fns.length === 1) {
      let fn = loop.fns[0]
      schema.render = function (scope, subscribe) {
        let el = document.createTextNode(fn(scope))
        let updateFn = value => el.textContent = value
        loop.models.forEach(model => subscribe(model, updateFn))
        return el
      }
    } else {
      schema.render = function (scope, subscribe) {
        let el = document.createTextNode(loop.fns.reduce((str, fn) => str + fn(scope), ''))
        let updateFn = () => el.textContent = loop.fns.reduce((str, fn) => str + fn(scope), '')
        loop.models.forEach(model => subscribe(model, updateFn))
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
  schema.render = (outerScope, outerSubscribe = getSubscriber(outerScope)) => {
    let { subscribe, scope } = getScope(outerScope, schema.scope, outerSubscribe),
        el = document.createElement(schema.localName),
        nut = { el, scope }
    // render attributes
    if (attribs) renderAttributes(el, scope, subscribe)
    // add events
    if (events) {
      Object.keys(events).forEach(type => el.addEventListener(type, e => events[type](e, nut)))
    }
    // render children
    if (schema.children) {
      schema.children.forEach(c => el.appendChild(c.render(scope, subscribe)))
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

function compileLoop (schema, callback) {
  let { events, children, attribs } = schema
  let renderAttributes
  if (attribs) {
    renderAttributes = compileAttributes(attribs)
  }
  schema.render = (outerScope) => {
    let scope = getScope(outerScope, schema.scope),
        el = document.createElement(schema.localName),
        nut = { el, scope }
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
    if ('repeat' in schema) {
      compileLoop(schema, callback)
    } else {
      compileTag(schema, callback)
    }
  } else if (schema.type === 3) {
    compileText(schema, callback)
  }
}

export default function (inLinks) {
  links = inLinks
  return compile
}
