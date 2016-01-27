'use strict'

export default function (links) {
  let handler = {
    set (target, prop, value, receiver) {
      if (typeof value !== 'object') {
        let link = links.get(receiver)
        if (link.has(prop)) {
          link.get(prop).forEach(f => f(value))
        } else {
          link.set(prop, new Set())
        }
        return Reflect.set(target, prop, value)
      } else if (value) {
        let p = deepProxy(value)
        return Reflect.set(target, prop, p)
      }
    }
  }

  function deepProxy (obj) {
    let sets = [],
        out = Array.isArray(obj) ? [] : {}
    Object.keys(obj).forEach(k => {
      if (typeof obj[k] === 'object') {
        if (obj[k]) out[k] = deepProxy(obj[k])
      } else {
        sets.push(k)
        out[k] = obj[k]
      }
    })
    let p = new Proxy(out, handler)
    let link = links.get(p) || links.set(p, new Map()).get(p)
    sets.forEach(k => !link.has(k) && link.set(k, new Set()))
    return p
  }
  return deepProxy
}
