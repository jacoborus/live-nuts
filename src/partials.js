'use strict'

function extract (parsed) {
  let partials = []
  if (parsed.as) {
    let partial = {source: parsed}
    parsed.partial = partial
    partials.push(partial)
  }
  if (parsed.children) {
    parsed.children.forEach(child => partials = partials.concat(extract(child)))
  }
  return partials
}

exports.extract = extract
