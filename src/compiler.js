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

function compileAttributes (schema) { // compile attributes
  let atts = schema.attribs
  let fns = Object.keys(atts).map(name => {
    let value = atts[name]
    if (name.endsWith('-')) {
      let att = name.slice(0, -1)
      let model = value.match(matcher)[1].trim()
      schema.booleans = schema.booleans || {}
      schema.booleans[att] = model
      return function (nut, box) {
        let updateFn = () => {
          if (box.get()[model]) {
            nut.el.setAttribute(att, '')
          } else {
            nut.el.removeAttribute(att)
          }
        }
        box.subscribe(nut.scope, model, updateFn)
        updateFn()
      }
    } else {
      if (!value.match(matcher)) {
        return nut => nut.el.setAttribute(name, value)
      }
      let { reduce, models } = compileStr(value)
      return function (nut, box) {
        let updateFn = () => nut.el.setAttribute(name, reduce(nut.scope))
        models.forEach(model => box.subscribe(nut.scope, model, updateFn))
        updateFn()
      }
    }
  })
  return (nut, box) => fns.forEach(fn => fn(nut, box))
}

function compileText (schema, callback) {
  let data = schema.data
  if (data.match(matcher)) {
    let { reduce, models } = compileStr(data)
    schema.render = function (scope, box) {
      let el = document.createTextNode(reduce(scope))
      let updateFn = () => el.textContent = reduce(scope)
      models.forEach(model => box.subscribe(scope, model, updateFn))
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
    exec: (nut, box) => pile.forEach(fn => fn(nut, box))
  }
}

function compileEvents (events) {
  return (nut, box) => {
    Object.keys(events).forEach(k => nut.el.addEventListener(k, e => events[k](e, nut, box)))
  }
}

function compileChildren (children) {
  return (nut, box) => children.forEach(c => nut.el.appendChild(c.render(nut.scope, box)))
}

function compileTag (schema, callback) {
  let { events, children, attribs } = schema
  let scopeAtt = schema.scope
  let stack = createStack()

  schema.render = (outerScope, box) => {
    if (scopeAtt && !outerScope[scopeAtt]) return document.createDocumentFragment()
    let scope = scopeAtt ? outerScope[scopeAtt] : outerScope,
        nut = { scope, el: document.createElement(schema.localName) }
    stack.exec(nut, box.getBox(scope))
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

function compileLoop (schema, callback) {
  let { events, children, attribs, repeat } = schema
  let scopeAtt = schema.scope
  let stack = createStack()

  schema.render = (outerScope, box) => {
    let fragment = document.createDocumentFragment()
    let scope = scopeAtt ? outerScope[scopeAtt][repeat] : outerScope[repeat]

    scope.forEach(item => {
      let nut = { scope: item, el: document.createElement(schema.localName) }
      stack.exec(nut, box.getBox(item))
      fragment.appendChild(nut.el)
    })
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
