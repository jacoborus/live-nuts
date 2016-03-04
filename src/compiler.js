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
      let att = name.slice(0, -1)
      let model = value.match(matcher)[1].trim()
      schema.booleans = schema.booleans || {}
      schema.booleans[att] = model
      return function (nut, box) {
        let updateFn = scope => {
          if (scope[model]) {
            nut.el.setAttribute(att, '')
          } else {
            nut.el.removeAttribute(att)
          }
        }
        box.subscribe(updateFn)
        updateFn(box.get())
      }
    } else {
      if (!value.match(matcher)) {
        return nut => nut.el.setAttribute(name, value)
      }
      let reduce = compileStr(value)
      return function (nut, box) {
        let updateFn = scope => {
          let res = reduce(scope)
          nut.el.setAttribute(name, res)
        }
        box.subscribe(updateFn)
        updateFn(box.get())
      }
    }
  })
  return (nut, box) => fns.forEach(fn => fn(nut, box))
}

function compileText (schema, callback) {
  let data = schema.data
  if (data.match(matcher)) {
    let reduce = compileStr(data)
    schema.render = function (scope, box) {
      let el = document.createTextNode(reduce(box.get()))
      let updateFn = () => el.textContent = reduce(box.get())
      box.subscribe(updateFn)
      return el
    }
  } else {
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
  let { events, children, attribs } = schema
  let scopeAtt = schema.scope
  let stack = createStack()

  schema.render = (scope, box) => {
    if (scopeAtt && !scope[scopeAtt]) return document.createDocumentFragment()
    if (scopeAtt) {
      scope = scope[scopeAtt]
    }
    let nut = { scope, el: document.createElement(schema.localName) }
    let localBox = scopeAtt ? box.getBox(scope) : box
    stack.exec(nut, localBox)
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
function compileVirtualLoopTag () {}
function compileVirtualLoopTag () {}

function compileLoop (schema, callback) {
  let { events, children, attribs, repeat } = schema
  let scopeAtt = schema.scope
  let stack = createStack()

  schema.render = (scope, box) => {
    let fragment = document.createDocumentFragment()
    if (scopeAtt) {
      scope = scope[scopeAtt][repeat]
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
