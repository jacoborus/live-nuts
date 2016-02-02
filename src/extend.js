'use strict'

const nuProps = [
  'voidElement',
  'type',
  'name',
  'data',
  'scope',
  'model',
  'repeat',
  'if',
  'unless',
  'attribs'
]

export default function (src, extension, next) {
  if (!extension) return next()

  nuProps.forEach(prop => {
    if (!(prop in src) && prop in extension) {
      src[prop] = extension[prop]
    }
  })

  if (!('attribs' in src) && 'attribs' in extension) {
    src.attribs = {}
  }

  if ('attribs' in extension) {
    for (let i in extension['attribs']) {
      if (!(i in src.attribs)) {
        src.attribs[i] = extension.attribs[i]
      }
    }
  }

  if (!src.children && extension.children) {
    src.childrenFrom = extension.key
    src.children = extension.children
  }
  delete src.as

  next()
}
