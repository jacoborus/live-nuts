'use strict'

const nuProps = [
  'voidElement',
  'nutName',
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

const extend = function (source, extension) {
  let schema = {},
      extent = Object.create(extension || null)

  delete extent.nutName

  nuProps.forEach(prop => {
    if (source[prop] !== undefined) {
      extent[prop] = source[prop]
    }
  })

  nuObjs.forEach(o => {
    if (source[o]) {
      extent[o] = extent[o] || {}
      for (let i in source[o]) {
        extent[o][i] = source[o][i]
      }
    }
  })

  // TODO: add new hash as nut name
  if (source.nutName) {
    schema.nutName = source.nutName
  }

  // use the children of source template
  if (source.children) {
    extent.children = source.children
  }

  return extent
}

module.exports = extend
