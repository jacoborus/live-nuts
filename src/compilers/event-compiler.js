'use strict'

export default function (events) {
  return (nut, box) => {
    Object.keys(events).forEach(k => {
      nut.el.addEventListener(k, e => events[k](e, nut, box))
    })
  }
}
