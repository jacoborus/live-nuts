'use strict'

const subscriptions = new Map()

// will store pairs of {proxy: object}
let pairs = new Map()

function subscribe (obj, prop, action) {
  let link = subscriptions.get(pairs.get(obj))
  let stack = link.get(prop) || link.set(prop, new Set()).get(prop)
  stack.add(action)
  return () => stack.delete(action)
}

function createSubsSet (target, prop, value) {
  let link = subscriptions.get(target)
  if (link.has(prop)) {
    link.get(prop).forEach(f => f(value))
  } else {
    link.set(prop, new Set())
  }
}

const handler = {
  set (target, prop, value) {
    if (typeof value !== 'object') {
      let ok = Reflect.set(target, prop, value)
      if (ok) {
        createSubsSet(target, prop, value)
      }
      return ok
    } else if (value) {
      let p = subscriptions.has(value) ? value : deepProxy(value)
      subscriptions.delete(target.prop)
      createSubsSet(target, prop, value)
      return Reflect.set(target, prop, p)
    }
  },
  deleteProperty (target, prop) {
    let del = delete target[prop]
    let link = subscriptions.get(target)
    link.get(prop).forEach(f => f())
    return del
  }
}

function deepProxy (obj) {
  let out = Array.isArray(obj) ? [] : {},
      keys = new Set()
  Object.keys(obj).forEach(k => {
    if (obj[k] && typeof obj[k] === 'object') {
      out[k] = deepProxy(obj[k])
    } else {
      out[k] = obj[k]
    }
    keys.add(k)
  })
  let p = new Proxy(out, handler)
  pairs.set(p, out)
  let link = subscriptions.set(out, new Map()).get(out)
  keys.forEach(k => link.set(k, new Set()))
  return p
}

export default {
  createStore: deepProxy,
  subscribe
}
