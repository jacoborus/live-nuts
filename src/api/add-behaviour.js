'use strict'

export default function (behaviours, next) {
  return function (templateName, options) {
    if (options) {
      behaviours.set(templateName, options)
    }
    next()
  }
}
