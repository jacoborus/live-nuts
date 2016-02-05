'use strict'

import newCounter from './counter.js'

let links
const matcher = /{{([^}]*)}}/

function getRepeatedScope (scope, repeatAtt) {
  if (repeatAtt) {
    if (!scope[repeatAtt]) scope[repeatAtt] = []
    return scope[repeatAtt]
  } else {
    return scope
  }
}

function getSubscriber (obj) {
  let link = links.get(obj)
  return function (prop, action) {
    link.get(prop).add(action)
  }
}

function getScopeAndSubscribe (scope, scopeAtt, subscribe) {
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
    return []
  }
  let st = str.match(matcher)
  if (st.index) {
    let out = str.substr(0, st.index)
    let fns = parseStr(str.substring(st.index))
    return [() => out].concat(fns)
  } else {
    let model = st[1].trim()
    let fns = parseStr(str.substring(st[0].length))
    return [scope => scope[model] || ''].concat(fns)
  }
}

function compileStr (str) {
  let fns = parseStr(str)
  let reduce
  if (fns.length === 1) {
    reduce = scope => fns[0](scope)
  } else {
    reduce = scope => fns.reduce((str, fn) => str + fn(scope), '')
  }
  let models = new Set()
  str.replace(/{{(.*?)}}/g, (g0, g1) => models.add(g1.trim()))
  return { reduce, models }
}

function compileAttributes (atts) { // compile attributes
  let fns = []
  Object.keys(atts).forEach(name => {
    let value = atts[name]
    if (value.match(matcher)) {
      let { reduce, models } = compileStr(value)
      fns.push(function (el, scope, subscribe) {
        let updateFn = () => {
          el.setAttribute(name, reduce(scope))
        }
        models.forEach(model => subscribe(model, updateFn))
        updateFn()
      })
    } else {
      fns.push(el => el.setAttribute(name, value))
    }
  })
  return (el, scope, subscribe) => fns.forEach(fn => fn(el, scope, subscribe))
}

function compileText (schema, callback) {
  let data = schema.data
  if (data.match(matcher)) {
    let { reduce, models } = compileStr(data)
    schema.render = function (scope, subscribe) {
      let el = document.createTextNode(reduce(scope))
      let updateFn = () => el.textContent = reduce(scope)
      models.forEach(model => subscribe(model, updateFn))
      return el
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
    let { subscribe, scope } = getScopeAndSubscribe(outerScope, schema.scope, outerSubscribe),
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
    let scope = getScopeAndSubscribe(outerScope, schema.scope),
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
