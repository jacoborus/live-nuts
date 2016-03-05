'use strict'

import newCounter from './counter.js'
const matcher = /{{([^}]*)}}/

function parseStr (str) {
  if (!str) return []
  let st = str.match(matcher)
  if (st.index) {
    let out = str.substr(0, st.index)
    let fns = parseStr(str.substring(st.index))
    return [() => out].concat(fns)
  } else {
    let prop = st[1].trim()
    let fns = parseStr(str.substring(st[0].length))
    return [scope => scope[prop] || ''].concat(fns)
  }
}

function compileStr (str) {
  let fns = parseStr(str)
  let reduce
  if (fns.length === 1) {
    let fn = fns[0]
    reduce = scope => fn(scope)
  } else {
    reduce = scope => fns.reduce((str, fn) => str + fn(scope), '')
  }
  return reduce
}

function compileAttributes (schema) { // compile attributes
  let atts = schema.attribs
  let fns = Object.keys(atts).map(name => {
    let value = atts[name]
    if (name.endsWith('-')) {
      // is boolean
      let att = name.slice(0, -1)
      let prop = value.match(matcher)[1].trim()
      schema.booleans = schema.booleans || {}
      schema.booleans[att] = prop
      let updateFn = (scope, cached, el) => {
        let fresh = scope[prop]
        if (fresh !== cached) {
          if (fresh) {
            el.setAttribute(att, '')
          } else {
            el.removeAttribute(att)
          }
          return fresh
        } else {
          return cached
        }
      }
      return function (nut, box) {
        let scope = nut.scope
        let cached = scope[prop]
        let el = nut.el
        box.subscribe(() => cached = updateFn(scope, cached, el), nut.scope)
        if (cached) {
          el.setAttribute(att, '')
        } else {
          el.removeAttribute(att)
        }
      }
    } else {
      // is regular
      if (!value.match(matcher)) {
        return nut => nut.el.setAttribute(name, value)
      }
      // is scoped value
      let reduce = compileStr(value)
      let updateFn = (scope, cached, el) => {
        let fresh = reduce(scope)
        if (fresh !== cached) {
          el.setAttribute(name, fresh)
          return fresh
        }
        return cached
      }
      return function (nut, box) {
        let scope = nut.scope
        let el = nut.el
        let cached = reduce(scope)
        box.subscribe(() => cached = updateFn(scope, cached, el), nut.scope)
        el.setAttribute(name, cached)
      }
    }
  })
  return (nut, box) => fns.forEach(fn => fn(nut, box))
}

function compileText (schema, callback) {
  let data = schema.data
  if (data.match(matcher)) {
    // text node has scoped content
    let reduce = compileStr(data)
    let updateFn = (scope, cached, el) => {
      let fresh = reduce(scope)
      if (fresh !== cached) {
        el.textContent = fresh
        return fresh
      }
      return cached
    }
    schema.render = function (scope, box) {
      let cached = reduce(scope)
      let el = document.createTextNode(cached)
      box.subscribe(() => updateFn(scope, cached, el), scope)
      return el
    }
  } else {
    // is regular text node
    schema.render = () => document.createTextNode(data)
  }
  callback()
}

function compileEvents (events) {
  return (nut, box) => {
    Object.keys(events).forEach(k => {
      nut.el.addEventListener(k, e => events[k](e, nut, box))
    })
  }
}

function compileChildren (children) {
  return (nut, box) => children.forEach(c => {
    nut.el.appendChild(c.render(nut.scope, box))
  })
}

function createStack () {
  let pile = []
  return {
    add: fn => pile.push(fn),
    exec: (nut, box) => pile.forEach(fn => fn(nut, box))
  }
}

function compileTag (schema, callback) {
  let { events, children, attribs, model } = schema
  let stack = createStack()

  let getScope
  if (model) {
    getScope = scope => scope[model]
  } else {
    getScope = scope => scope
  }

  schema.render = (scope, box) => {
    scope = getScope(scope)
    if (!scope) return document.createDocumentFragment()
    let nut = { scope, el: document.createElement(schema.localName) }
    stack.exec(nut, box)
    return nut.el
  }

  if (attribs) stack.add(compileAttributes(schema))
  if (events) stack.add(compileEvents(events))
  if (children) {
    stack.add(compileChildren(children))
    let count = newCounter(children.length, callback)
    children.forEach(c => compile(c, count))
  } else {
    callback()
  }
}

function compileVirtualLoopTag () {}

function compileLoop (schema, callback) {
  let { events, children, attribs, repeat, model } = schema
  let stack = createStack()

  schema.render = (scope, box) => {
    let fragment = document.createDocumentFragment()
    if (model) {
      scope = scope[model][repeat]
    } else {
      scope = scope[repeat]
    }

    if (scope) {
      scope.forEach(item => {
        let nut = { scope: item, el: document.createElement(schema.localName) }
        stack.exec(nut, box)
        fragment.appendChild(nut.el)
      })
    }
    return fragment
  }

  if (attribs) stack.add(compileAttributes(schema))
  if (events) stack.add(compileEvents(events))
  if (children) {
    stack.add(compileChildren(children))
    let count = newCounter(children.length, callback)
    children.forEach(c => compile(c, count))
  } else {
    callback()
  }
}

export default function compile (schema, callback) {
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
