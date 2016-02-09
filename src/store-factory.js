'use strict'

const subscriptions = new Map()

// will store pairs of {proxy: object}
let pairs = new Map()

const handler = {
  set (target, prop, value) {
    if (typeof value !== 'object') {
      let ok = Reflect.set(target, prop, value)
      if (ok && subscriptions.has(target)) {
        let link = subscriptions.get(target)
        if (link.has(prop)) {
          link.get(prop).forEach(f => f(value))
        } else {
          link.set(prop, new Set())
        }
      }
      return ok
    } else if (value) {
      let p = deepProxy(value)
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
      keys.add(k)
    } else {
      out[k] = obj[k]
      keys.add(k)
    }
  })
  let p = new Proxy(out, handler)
  pairs.set(p, out)
  let link = subscriptions.set(out, new Map()).get(out)
  keys.forEach(k => link.set(k, new Set()))
  return p
}

function subscribe (obj, prop, action) {
  let link = subscriptions.get(pairs.get(obj))
  let stack = link.get(prop) || link.set(prop, new Set()).get(prop)
  stack.add(action)
  return () => stack.delete(action)
}

export default {
  createStore: deepProxy,
  subscribe
}
