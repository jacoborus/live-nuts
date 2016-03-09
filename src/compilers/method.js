'use strict'

export default function (methods) {
  let keys = Object.keys(methods)
  return function (nut) {
    keys.forEach(k => nut[k] = methods[k])
  }
}
