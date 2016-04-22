'use strict'

const matcher = /{{([^}]*)}}/

function parseStr (str) {
  if (!str) return []
  let st = str.match(matcher)
  if (st.index) {
    let out = str.substr(0, st.index)
    let fns = parseStr(str.substring(st.index))
    return [() => out].concat(fns)
  } else {
    let prop = st[1].trim()
    let fns = parseStr(str.substring(st[0].length))
    return [scope => prop in scope ? scope[prop] : ''].concat(fns)
  }
}

module.exports = function (str) {
  let fns = parseStr(str)
  let reduce
  if (fns.length === 1) {
    let fn = fns[0]
    reduce = scope => fn(scope)
  } else {
    reduce = scope => fns.reduce((str, fn) => str + fn(scope), '')
  }
  return reduce
}
