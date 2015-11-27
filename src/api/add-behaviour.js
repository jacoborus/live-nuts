'use strict'

/**
 * function
 *
 * @param {object} behaviours behaviours archive
 * @param {function} next callback
 * @return {function} function that adds behaviours to behaviours archive
 */
export default function (behaviours, next) {
  return function (templateName, behaviour) {
    if (behaviour) {
      behaviours.set(templateName, behaviour)
    }
    next()
  }
}
