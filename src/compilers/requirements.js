'use strict'

const reqs = {
  nuif (schema) {
    if ('nuif' in schema && 'unless' in schema) {
      let nuif = schema.nuif,
          unless = schema.unless
      return scope => scope[nuif] && !scope[unless]
    } else if ('nuif' in schema) {
      let model = schema.nuif
      return scope => scope[model] ? true : false
    } else {
      let model = schema.unless
      return scope => !scope[model]
    }
  },

  model (schema) {
    let { model } = schema
    return scope => scope[model] && typeof scope[model] === 'object'
  },

  modelIf (schema) {
    let model = schema.model
    let fn = reqs.model(schema)
    let fn2 = reqs.nuif(schema)
    return scope => fn(scope) && fn2(scope[model])
  }
}

export default function (schema) {
  if ('model' in schema) {
    if ('nuif' in schema || 'unless' in schema) {
      return reqs.modelIf(schema)
    } else {
      return reqs.model(schema)
    }
  } else {
    if ('nuif' in schema || 'unless' in schema) {
      return reqs.nuif(schema)
    } else {
      return false
    }
  }
}
