'use strict'

import newCounter from './counter.js'

const matcher = /{{([^}]*)}}/

let links

function getScope (scope, scopeAtt) {
  if (scopeAtt) {
    if (!scope[scopeAtt]) scope[scopeAtt] = {}
    return scope[scopeAtt]
  } else {
    return scope
  }
}

function loopStr (str) {
  if (!str) return []
  let st = str.match(matcher)
  if (st.index) {
    return [() => str.substr(0, st.index)]
      .concat(loopStr(str.substring(st.index)))
  } else {
    let model = st[1].trim()
    return [scope => scope[model] || '']
      .concat(loopStr(str.substring(st[0].length)))
  }
}

function compileAttributes (atts) { // compile attributes
  let fns = []
  for (let att in atts) {
    let value = atts[att]
    if (value.match(matcher)) {
      let loop = loopStr(value)
      fns.push(function (el, scope) {
        el.setAttribute(att, loop.reduce((str, fn) => str + fn(scope), ''))
      })
    } else {
      fns.push(el => el.setAttribute(att, value))
    }
  }
  return (el, scope) => fns.forEach(fn => fn(el, scope))
}

export default function (inLinks) {
  links = inLinks
  return function compile (schema, callback) {
    let { events, children, attribs } = schema
    let renderAttributes
    if (attribs) {
      renderAttributes = compileAttributes(attribs)
    }
    schema.render = (outerScope) => {
      let scope = getScope(outerScope, schema.scope)
      let el = document.createElement(schema.localName)
      let nut = { el, scope }
      if (attribs) renderAttributes(el, scope)

      // add events
      if (events) {
        Object.keys(events).forEach(type => el.addEventListener(type, e => events[type](e, nut)))
      }
      if (schema.children) {
        schema.children.forEach(c => el.appendChild(c.render(scope)))
      }
      return el
    }

    if (children && children.length) {
      let count = newCounter(children.length, callback)
      children.forEach(c => compile(c, count))
    } else {
      callback()
    }
  }
}
