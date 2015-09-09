(function (window) {
'use strict'

const forEach = Array.prototype.forEach

let templates = {},
    allCompiled = false

// list of attributes to extract from tags
const nuProps = [
  'type',
  'name',
  'class',
  'nuClass',
  'scope',
  'model',
  'repeat',
  'pipe',
  'if',
  'unless',
  'checked',
  'doctype',
  'children',
  'namesakes',
  'nuSakes'
]

const nuObjs = [
  'attribs',
  'nuAtts',
  'namesakes',
  'nuSakes'
]

// TODO: test this
const partial = function (target, obj) {
  nuProps.forEach(function (p) {
    if (obj[p] !== undefined) {
      target[p] = obj[p]
    }
  })

  // assign children schemas to tag if has children
  if (obj.children.length) {
    if (obj.children.length !== 1 || obj.children[0].schema.data !== ' ') {
      target.children = obj.children
    }
  }

  nuObjs.forEach(function (o) {
    obj[o].forEach(function (el, i) {
      target[o][i] = obj[o][i]
    })
  })
  return target
}

const getNutName = function (atts) {
  if (atts.nut) {
    return atts.nut.value
  } else {
    return false
  }
}

const getAttributes = function (atts) {
  let obj = {}
  forEach.call(atts, att => obj[att.nodeName] = att.value)
  return obj
}

/* - Utils */
// detect if an attribute name is prefixed with nu-
const hasNuPrefix = function (str) {
  return str.indexOf('nu-') === 0
}

// remove nu- prefix from attribute
const getNuProp = function (prop) {
  return prop.substr(3, prop.length)
}

const hasProp = function (name, list) {
  return list[name] !== undefined && list[name]
}

// move attributes with nu- prefix to nuAtts property
const separateNamesakes = function (atts, nuAtts) {
  let names = {},
      sakes = {}

  for (let att in atts) {
    if (hasProp(att, nuAtts)) {
      names[att] = atts[att]
      sakes[att] = nuAtts[att]
      delete atts[att]
      delete nuAtts[att]
    }
  }
  return [names, sakes]
}

// move attributes with nu- prefix to nuAtts property
const separateNuAtts = function (atts) {
  let nuAtts = {}

  for (let att in atts) {
    if (hasNuPrefix(att)) {
      nuAtts[ getNuProp(att)] = atts[att]
      delete atts[att]
    }
  }
  return nuAtts
}

const TagSchema = function (attributes, dom) {
  let atts = getAttributes(attributes),
      domChildren, nuChildren

  switch (dom.nodeType) {
    case 1:
      this.type = 'tag'
      break
    case 3:
      this.type = 'text'
      break
    case 8:
      this.type = 'comment'
      break
    case 10:
      this.type = 'directive'
      break
  }

  this.data = dom.data

  this.name = dom.localName

  // assign attributes

  // separate special attributes
  if (atts.class) {
    this.class = atts.class
    delete atts.class
  }
  if (atts['nu-class']) {
    this.nuClass = atts['nu-class']
    delete atts['nu-class']
  }
  if (atts['nu-scope']) {
    this.scope = atts['nu-scope']
    delete atts['nu-scope']
  }
  if (atts['nu-model'] || atts['nu-model'] === '') {
    this.model = atts['nu-model']
    delete atts['nu-model']
  }
  if (atts['nu-repeat'] || atts['nu-repeat'] === '') {
    this.repeat = atts['nu-repeat']
    delete atts['nu-repeat']
  }
  if (atts['nu-each'] || atts['nu-each'] === '') {
    this.each = atts['nu-each']
    delete atts['nu-each']
  }
  if (atts['nu-pipe'] || atts['nu-pipe'] === '') {
    this.pipe = atts['nu-pipe']
    delete atts['nu-pipe']
  }
  if (atts['nu-block'] || atts['nu-block'] === '') {
    this.block = atts['nu-block']
    delete atts['nu-block']
  }
  if (atts['nu-if'] || atts['nu-if'] === '') {
    if (atts['nu-if']) {
      this.nuif = atts['nu-if']
    }
    delete atts['nu-if']
  }
  if (atts['nu-unless'] || atts['nu-unless'] === '') {
    if (atts['nu-unless']) {
      this.unless = atts['nu-unless']
    }
    delete atts['nu-unless']
  }
  if (atts['nu-checked'] || atts['nu-checked'] === '') {
    this.checked = atts['nu-checked']
    delete atts['nu-checked']
  }
  if (atts['nu-doctype'] === '') {
    this.doctype = true
    delete atts['nu-doctype']
  }
  if (atts['nu-as'] || atts['nu-as'] === '') {
    if (atts['nu-as']) {
      this.as = atts['nu-as']
    }
    delete atts['nu-as']
  }

  // separate nuAttributes from the regular ones
  this.nuAtts = separateNuAtts(atts)
  let sakes = separateNamesakes(atts, this.nuAtts)
  this.namesakes = sakes[0]
  this.nuSakes = sakes[1]

  // assign children dom elements
  if (dom.childNodes && dom.childNodes.length) {
    this.children = []
    nuChildren = this.children
    domChildren = dom.childNodes
    forEach.call(domChildren, (child, i) => {
      nuChildren[i] = {
        src: null,
        schema: new TagSchema(child.attributes || [], child)
      }
    })
  }

  // assign attributes
  delete atts.nut
  this.attribs = atts || {}
}

/**
 * Nuts constructor
 */
class Nuts {
  /**
   * Add a templates and generate its model
   * @param {String}   source html templates
   * @param {Function} callback    Signature: error
   */
  addTemplate (src, callback) {
    let div = document.createElement('div')
    div.innerHTML = src

    forEach.call(div.childNodes, el => {
      let name = getNutName(el.attributes)
      allCompiled = false
      if (name) {
        templates[name] = {
          src: el.outerHTML,
          schema: new TagSchema(el.attributes, el),
          nut: name
        }
      }
    })
    callback(null)
  }

  /**
   * Get a template object from templates
   * @param  {String} name template keyname
   * @return {Object}      template object
   */
  getTemplate (name) {
    return templates[name]
  }

  /**
   * Get a rendered template
   * @param  {String} tmplName template keyname
   * @param  {Object} data     locals
   * @return {String}          rendered html
   */
  render (tmplName, data) {
    data = data || {}
    if (!allCompiled) {
      for (let i in templates) {
        templates[i].render = compileTag(templates[i])
      }
      allCompiled = true
    }
    let tmpl = templates[tmplName]
    if (tmpl) {
      if (tmpl.schema.nuif === undefined) {
        return tmpl.render(data)
      }
      if (tmpl.schema.nuif === '') {
        return data ? tmpl.render(data) : ''
      }
      return data[tmpl.schema.nuif] ? tmpl.render(data) : ''
    }
    return ''
  }
}

const printChildren = function (children, x) {
  let fragment = document.createDocumentFragment()
  forEach.call(children, child => fragment.appendChild(child.render(x)))
  return fragment
}

const direct = function (t, el) {
  let pipe = t.pipe,
      scope = t.scope,
      model = t.model,
      nuSakes = t.nuSakes,
      children = t.children,
      namesakes = t.namesakes,
      nuAtts = t.nuAtts,
      nuClass = t.nuClass,
      checked = t.checked,
      each = t.each

  return function (x) {
    let props = [],
        preX = {},
        i, z

    if (pipe === '') {
      for (i in x) {
        preX[i] = x[i]
      }
    }
    if (pipe) {
      props = pipe.split(' ')
      for (i in props) {
        preX[props[i]] = x[props[i]]
      }
    }
    // set scope
    if (scope) {
      if (x[scope]) {
        x = x[scope]
      } else {
        x = {}
      }
    }
    // pipe properties from parent
    if (pipe || pipe === '') {
      for (i in preX) {
        x[i] = preX[i]
      }
    }

    // render nuClass
    if (nuClass) {
      el.classList.add(x[nuClass])
    }

    // render namesakes
    for (i in namesakes) {
      el.setAttribute(i, nuSakes[i] || namesakes[i])
    }

    // render nuAttributes
    for (i in nuAtts) {
      el.setAttribute(i, x[nuAtts[i]] || '')
    }

    // print checked attribute
    if (checked === '') {
      if (x) {
        el.checked = true
      }
    } else if (checked) {
      if (x[checked]) {
        el.checked = true
      }
    }

    if (each || each === '') {
      if (each === '') {
        z = x
      } else if (x[each]) {
        z = x[each]
      }
      if (z) {
        forEach.call(z, j => {
          if (children) {
            el.appendChild(printChildren(children, j).cloneNode(true))
          }
        })
      }
    } else {
      // compile content
      if (model && x[model]) {
        el.innerHTML = x[model]
      } else if (model === '') {
        el.innerHTML = x
      } else {
        if (children) {
          el.appendChild(printChildren(children, x).cloneNode(true))
        }
      }
    }
    return el
  }
}

/* - Generate compiled tags - */
let compileTag

const newCompiledText = function (tmp) {
  let out = document.createTextNode(tmp.data)
  return function () {
    return out
  }
}

const newCompiledComment = function (tmp) {
  let out = document.createComment(tmp.data)
  return function () {
    return out
  }
}

const newCompiledDirective = function (tmp) {
  let out = '<' + tmp.data + '>'
  return function () {
    return out
  }
}

const newCompiledTag = function (tmp) {
  if (tmp.as) {
    tmp = partial(tmp, templates[tmp.as].schema)
    delete tmp.as
  }

  // crete element
  let el = document.createElement(tmp.name),
      atts = tmp.attribs

  // preprint doctype
  /*
  if (tmp.doctype) {
    preTag = '<!DOCTYPE html>' + preTag
  }
  */
  // render regular attributes
  for (let i in atts) {
    el.setAttribute(i, atts[i])
  }

  // prepare className tag
  if (tmp.class) {
    el.classList.add(tmp.class)
  }

  let children = tmp.children
  for (let i in children) {
    children[i].render = compileTag(children[i])
  }
  return direct(tmp, el)
}

compileTag = function (template) {
  let schema = template.schema
  switch (schema.type) {
    case 'tag':
      return newCompiledTag(schema)
    case 'text':
      return newCompiledText(schema)
    case 'comment':
      return newCompiledComment(schema)
    case 'directive':
      return newCompiledDirective(schema)
  }
}

const nuts = new Nuts()

nuts.version = '0.0.1'
window.nuts = nuts

})(window)
