'use strict'

export default function (rosters) {
  let handler = {
    set (target, prop, value, receiver) {
      if (typeof value !== 'object') {
        let ok = Reflect.set(target, prop, value)
        if (ok) {
          let link = rosters.get(receiver)
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
    }
  }

  function deepProxy (obj) {
    let out = Array.isArray(obj) ? [] : {}
    Object.keys(obj).forEach(k => {
      if (obj[k] && typeof obj[k] === 'object') {
        out[k] = deepProxy(obj[k])
      } else {
        out[k] = obj[k]
      }
    })
    let p = new Proxy(out, handler)
    let link = rosters.set(p, new Map()).get(p)
    Object.keys(obj).forEach(k => !link.has(k) && link.set(k, new Set()))
    return p
  }
  return deepProxy
}
