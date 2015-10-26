'use strict'

export default function (views, next) {
  return function (templateName, options) {
    if (options) {
      views.set(templateName, options)
    }
    next()
  }
}
