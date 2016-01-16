'use strict'

import getDOMProto from './get-dom-proto.js'

export default function (schema, count) {
  let proto = getDOMProto(schema.localName)

  proto.attachedCallback = function () {
    this.isNut = true
    count()
  }

  document.registerElement(schema.tagName, {
    prototype: proto,
    extends: schema.localName
  })
}
