'use strict'

module.exports = function (events) {
  const keys = Object.keys(events)
  const map = new Map()
  keys.forEach(k => map.set(k, events[k]))

  return (el, nut) => {
    map.forEach((fnName, k) => {
      el.addEventListener(k, e => {
        nut[fnName](e, nut)
      })
    })
  }
}
