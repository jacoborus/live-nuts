'use strict'

const nuProps = [
  'voidElement',
  'type',
  'name',
  'data',
  'each',
  'class',
  'nuClass',
  'scope',
  'model',
  'repeat',
  'inherit',
  'nuif',
  'unless',
  'checked',
  'children',
  'formatters'
]

const nuObjs = [
  'attribs',
  'nuAtts'
]

module.exports = function (src, extension, next) {
  if (!extension) return next()

  nuProps.forEach(prop => {
    if (src[prop] === undefined && extension[prop] !== undefined) {
      src[prop] = extension[prop]
    }
  })

  nuObjs.forEach(o => {
    if (!src[o] && extension[o]) {
      src[o] = {}
    }
    if (extension[o]) {
      for (let i in extension[o]) {
        if (src[o][i] === undefined) {
          src[o][i] = extension[o][i]
        }
      }
    }
  })

  if (!src.children && extension.children) {
    src.children = extension.children
  }
  delete src.as

  next()
}
