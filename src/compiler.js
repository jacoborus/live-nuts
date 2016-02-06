'use strict'

import newCounter from './counter.js'

let links
const matcher = /{{([^}]*)}}/

function getSubscriber (obj) {
  let link = links.get(obj)
  return function (prop, action) {
    let subscriptions = link.get(prop) || link.set(prop, new Set()).get(prop)
    subscriptions.add(action)
  }
}

function getScopeAndSubscribe (scope, scopeAtt, subscribe) {
  if (scopeAtt) {
    return {
      scope: scope[scopeAtt],
      subscribe: getSubscriber(scope[scopeAtt])
    }
  } else {
    return { scope, subscribe }
  }
}

function getScopedLoop (scope, schema) {
  let scopeAtt = schema.scope
  if (scopeAtt) {
    return scope[scopeAtt][schema.repeat]
  } else {
    return scope[schema.repeat]
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
  let fns = Object.keys(atts).map(name => {
    let value = atts[name]
    if (name.endsWith('-')) {
      let att = name.slice(0, -1)
      let model = value.match(matcher)[1].trim()
      return function (nut) {
        let updateFn = () => {
          if (nut.scope[model]) {
            nut.el.setAttribute(att, '')
          } else {
            nut.el.removeAttribute(att)
          }
        }
        nut.subscribe(model, updateFn)
        updateFn()
      }
    } else {
      if (!value.match(matcher)) {
        return nut => nut.el.setAttribute(name, value)
      }
      let { reduce, models } = compileStr(value)
      return function (nut) {
        let updateFn = () => nut.el.setAttribute(name, reduce(nut.scope))
        models.forEach(model => nut.subscribe(model, updateFn))
        updateFn()
      }
    }
  })
  return (nut) => fns.forEach(fn => fn(nut))
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

function createStack () {
  let pile = []
  return {
    add: fn => pile.push(fn),
    exec: nut => pile.forEach(fn => fn(nut))
  }
}

function compileTag (schema, callback) {
  let { events, children, attribs } = schema
  let stack = createStack()
  if (attribs) stack.add(compileAttributes(attribs))
  if (events) {
    stack.add(nut => {
      Object.keys(events).forEach(type => {
        nut.el.addEventListener(type, e => events[type](e, nut))
      })
    })
  }
  if (children) {
    stack.add(nut => children.forEach(c => nut.el.appendChild(c.render(nut.scope, nut.subscribe))))
  }

  schema.render = (outerScope, outerSubscribe = getSubscriber(outerScope)) => {
    if (schema.scope && !outerScope[schema.scope]) return document.createDocumentFragment()
    let { subscribe, scope } = getScopeAndSubscribe(outerScope, schema.scope, outerSubscribe),
        el = document.createElement(schema.localName),
        nut = { el, scope, subscribe }
    stack.exec(nut)
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
    let scope = getScopedLoop(outerScope, schema),
        fragment = document.createDocumentFragment()

    scope.forEach(item => {
      let subscribeItem = getSubscriber(item)
      let el = document.createElement(schema.localName),
          nut = { el, scope: item }
      // render attributes
      if (attribs) renderAttributes(el, item, subscribeItem)
      // add events
      if (events) {
        Object.keys(events).forEach(type => el.addEventListener(type, e => events[type](e, nut)))
      }
      // render children
      if (schema.children) {
        schema.children.forEach(c => el.appendChild(c.render(item, subscribeItem)))
      }
      fragment.appendChild(el)
    })
    return fragment
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
