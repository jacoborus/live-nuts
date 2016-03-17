'use strict'

export default function (events) {
  return (el, nut) => {
    Object.keys(events).forEach(k => {
      let fnName = events[k]
      el.addEventListener(k, e => {
        nut[fnName](e, nut)
      })
    })
  }
}
