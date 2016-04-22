'use strict'

function extendGroup (src, ext) {
  if (ext) {
    Object.keys(ext).forEach(att => {
      if (!(att in src)) {
        src[att] = ext[att]
      }
    })
  }
}

module.exports = function (src, extension, next) {
  if (!extension) return next()

  // extend localName element props
  src.localName = extension.localName

  // extend attribs
  if ('attribs' in extension) {
    src.attribs = src.attribs || {}
    extendGroup(src.attribs, extension.attribs)
  }

  // extend `if` prop
  if (extension.props && 'if' in extension.props && !('if' in src.props)) {
    src.props.if = extension.props.if
  }

  // extend events
  if ('events' in extension) {
    // ensure src has events prop if extension has it too
    src.events = src.events || {}
    extendGroup(src.events, extension.events)
  }

  // extend children
  if (extension.children) {
    src.childrenFrom = extension.tagName
    src.children = extension.children
  } else {
    // ensure there are no children from src tag
    delete src.children
  }

  next()
}
