'use strict'

function getElement (template) {
  if (typeof template === 'string') {
    return document.createRange().createContextualFragment(template).childNodes[0]
  }
  return template
}

export default function (parse, templates, next) {
  return function (template) {
    let element = getElement(template),
        parsed = parse(element)
    if (parsed.keyname) {
      templates.set(parsed.keyname, parsed)
    }
    next()
  }
}
