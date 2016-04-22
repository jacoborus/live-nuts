'use strict'

const reqs = {
  // if, model, whether
  '111' (schema) {
    const checkWhether = reqs['100'](schema)
    const checkModel = reqs['010'](schema)
    return scope => checkWhether(scope) && checkModel(scope)
  },
  // model if
  '011' (schema) {
    return reqs['010'](schema)
  },
  // whether if
  '101' (schema) {
    const checkWhether = reqs['100'](schema)
    const checkIf = reqs['001'](schema)
    return scope => checkWhether(scope) && checkIf(scope)
  },
  // whether model
  '110' (schema) {
    const checkModel = reqs['010'](schema)
    const checkWhether = reqs['100'](schema)
    return scope => checkModel(scope) && checkWhether(scope)
  },
  // if
  '001' (schema) {
    let nuif = schema.if
    return scope => scope[nuif]
  },
  // model
  '010' (schema) {
    let { model } = schema
    return scope => scope[model] && typeof scope[model] === 'object'
  },
  // whether
  '100' (schema) {
    let { whether } = schema
    return scope => scope[whether]
  },
  '000': () => () => true
}

module.exports = function (schema) {
  let res = 'whether' in schema ? '1' : '0'
  res += 'model' in schema ? '1' : '0'
  res += 'if' in schema ? '1' : '0'
  return reqs[res](schema)
}
