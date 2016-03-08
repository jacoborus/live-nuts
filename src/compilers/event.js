'use strict'

export default function (events) {
  return (el, scope, nut) => {
    Object.keys(events).forEach(k => {
      el.addEventListener(k, e => events[k](e, nut))
    })
  }
}
