'use strict'
var templates = {},
  allCompiled = false

var nuProps = [
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

var nuObjs = [
  'attribs',
  'nuAtts',
  'namesakes',
  'nuSakes'
]

var partial = function (target, obj) {
  var i, j

  for (i in nuProps) {
    if (obj[nuProps[i]] || obj[nuProps[i]] === '') {
      target[nuProps[i]] = obj[nuProps[i]]
    }
  }
  if (obj.children.length > 0) {
    if (obj.children.length !== 1 || obj.children[0].schema.data !== ' ') {
      target.children = obj.children
    }
  }
  for (i in nuObjs) {
    for (j in obj[nuObjs[i]]) {
      target[nuObjs[i]][j] = obj[nuObjs[i]][j]
    }
  }
  return target
}

var getNutName = function (atts) {
  var len = atts.length,
    i = 0,
    att

  while (i < len) {
    att = atts[i]
    if (att.nodeName === 'nut') {
      return att.value
    }
    i++
  }
  return false
}

var getAttributes = function (atts) {
  var len = atts.length,
    obj = {},
    i = 0,
    att

  while (i < len) {
    if (atts.hasOwnProperty(i)) {
      att = atts[i]
      obj[att.nodeName] = att.value
    }
    i++
  }
  return obj
}

/* - Utils */
// detect if an attribute name is prefixed with nu-
var startsWithNu = function (str) {
  return str.indexOf('nu-') === 0
}
// remove nu- prefix from attribute
var getNuProp = function (prop) {
  return prop.substr(3, prop.length)
}

var hasProp = function (name, list) {
  var i
  for (i in list) {
    if (i === name) {
      return true
    }
  }
  return false
}

// move attributes with nu- prefix to nuAtts property
var separateNamesakes = function (atts, nuAtts) {
  var names = {},
    sakes = {},
    i

  for (i in atts) {
    if (hasProp(i, nuAtts)) {
      names[i] = atts[i]
      sakes[i] = nuAtts[i]
      delete atts[i]
      delete nuAtts[i]
    }
  }
  return [names, sakes]
}

// move attributes with nu- prefix to nuAtts property
var separateNuAtts = function (atts) {
  var nuAtts = {},
    i

  for (i in atts) {
    if (startsWithNu(i)) {
      nuAtts[ getNuProp(i)] = atts[i]
      delete atts[i]
    }
  }
  return nuAtts
}

var TagSchema = function (attributes, dom) {
  var atts = getAttributes(attributes),
    domChildren, nuChildren, i

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
  var sakes = separateNamesakes(atts, this.nuAtts)
  this.namesakes = sakes[0]
  this.nuSakes = sakes[1]

  // assign children dom elements
  if (dom.childNodes && dom.childNodes.length) {
    this.children = []
    nuChildren = this.children
    domChildren = dom.childNodes
    var len = domChildren.length
    i = 0
    while (i < len) {
      nuChildren[i] = {
        src: null,
        schema: new TagSchema(domChildren[i].attributes || [], domChildren[i])
      }
      i++
    }
  }

  // assign attributes
  delete atts.nut
  this.attribs = atts || {}
}

/**
 * Nuts constructor
 */
var Nuts = function () {
}

/**
 * Add a templates and generate its model
 * @param {String}   source html templates
 * @param {Function} callback    Signature: error
 */
Nuts.prototype.addTemplate = function (src, callback) {
  var div = document.createElement('div')
  div.innerHTML = src
  var elems = div.childNodes

  var i = 0,
    el, name, atts

  while (i < elems.length) {
    el = elems[i]
    atts = el.attributes
    name = getNutName(atts)
    allCompiled = false
    if (name) {
      templates[name] = {
        src: el.outerHTML,
        schema: new TagSchema(el.attributes, el),
        nut: name
      }
    }
    i++
  }
  callback(null)
}

/**
 * Get a template object from templates
 * @param  {String} name template keyname
 * @return {Object}      template object
 */
Nuts.prototype.getTemplate = function (name) {
  return templates[name]
}

var printChildren = function (children, x) {
  var i = 0,
    len = children.length
  var fragment = document.createDocumentFragment()
  while (i < len) {
    fragment.appendChild(children[i].render(x))
    i++
  }
  return fragment
}

var direct = function (t, el) {
  var pipe = t.pipe,
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
    var props = [],
      preX = {},
      len, i, j, z

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
        i = 0
        len = z.length
        while (i < len) {
          j = z[i]
          if (children) {
            el.appendChild(printChildren(children, j).cloneNode(true))
          }
          i++
        }
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
var compileTag

var newCompiledText = function (tmp) {
  var out = document.createTextNode(tmp.data)
  return function () {
    return out
  }
}

var newCompiledComment = function (tmp) {
  var out = document.createComment(tmp.data)
  return function () {
    return out
  }
}

var newCompiledDirective = function (tmp) {
  var out = '<' + tmp.data + '>'
  return function () {
    return out
  }
}

var newCompiledTag = function (tmp) {
  var nuas
  if (tmp.as) {
    nuas = tmp.as
    delete tmp.as
    tmp = partial(tmp, templates[nuas].schema)
  }

  // crete element
  var el = document.createElement(tmp.name),
    atts = tmp.attribs

  var i

  // preprint doctype
  /*
  if (tmp.doctype) {
    preTag = '<!DOCTYPE html>' + preTag
  }
  */
  // render regular attributes
  for (i in atts) {
    el.setAttribute(i, atts[i])
  }

  // prepare className tag
  if (tmp.class) {
    el.classList.add(tmp.class)
  }

  var children = tmp.children
  for (i in children) {
    children[i].render = compileTag(children[i])
  }
  return direct(tmp, el)
}

compileTag = function (template) {
  var schema = template.schema
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

/**
 * Get a rendered template
 * @param  {String} tmplName template keyname
 * @param  {Object} data     locals
 * @return {String}          rendered html
 */
Nuts.prototype.render = function (tmplName, data) {
  var i
  data = data || {}
  if (!allCompiled) {
    for (i in templates) {
      templates[i].render = compileTag(templates[i])
    }
    allCompiled = true
  }
  if (templates[tmplName]) {
    return templates[tmplName].render(data)
  }
  return ''
}

var nuts = new Nuts()
nuts.version = '0.0.1'
module.exports = nuts;
