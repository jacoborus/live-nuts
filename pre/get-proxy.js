'use strict'

let links

export default function (inLinks) {
  links = inLinks
  return deepProxy
}

function set (target, prop, value, receiver) {
  if (typeof value !== 'object') {
    let link = links.get(receiver)
    if (link.has(prop)) {
      link.get(prop).forEach(f => f(value))
    } else {
      link.set(prop, new Set())
    }
    return Reflect.set(target, prop, value)
  } else {
    let p = deepProxy(value)
    return Reflect.set(target, prop, p)
  }
}

let objectHandler = { set }
let arrayHandler = { set }

function createProxyObject (scope) {
  if (Array.isArray(scope)) {
    return new Proxy(scope, arrayHandler)
  } else {
    return new Proxy(scope, objectHandler)
  }
}

function deepProxy (obj) {
  let sets = [],
      out
  if (Array.isArray(obj)) {
    out = []
  } else {
    out = {}
  }
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === 'object') {
      if (obj[k]) out[k] = deepProxy(obj[k])
    } else {
      sets.push(k)
      out[k] = obj[k]
    }
  })
  let p = createProxyObject(out)
  let link = links.get(p) || links.set(p, new Map()).get(p)
  sets.forEach(k => !link.has(k) && link.set(k, new Set()))
  return p
}
