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

  // ensure src has attribs prop if extension has it too
  if (!('attribs' in src) && 'attribs' in extension) {
    src.attribs = {}
  }

  if ('attribs' in extension) {
    Object.keys(extension.attribs).forEach(att => {
      if (!(att in src.attribs)) {
        src.attribs[att] = extension.attribs[att]
      }
    })
  }

  // extend events
  if ('events' in extension) {
    // ensure src has events prop if extension has it too
    src.events = src.events || {}
    Object.keys(extension.events).forEach(eName => {
      if (!src.events[eName]) {
        src.events[eName] = extension.events[eName]
      }
    })
  }

  if (!src.children && extension.children) {
    src.childrenFrom = extension.key
    src.children = extension.children
  }
  delete src.as

  next()
}
