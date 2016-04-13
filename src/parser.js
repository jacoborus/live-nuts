'use strict'

/**
 * parser
 *
 * Parse a nuts template tag and its children into a object.
 *
 * List of properties
 *
 * - `type` *number*: is the DOM node type (1: element, 3: text)
 * - `localName` *string*: the localname of the tag
 * - `tagName` *string*: the name of the template
 * - `data` *string*: the content of text nodes
 * - `attribs` *object*: with tag attributes excluding events and nut attributes
 * - `events` *object*: keys are event names, and values are the callbacks
 * - `settings` *object*: control properties (model, repeat, if, unless, hide, show, as)
 * - `children` *array*: children schemas
 *
 * Children can have all properties but `tagName`.
 * Nut templates can have all properties but `model`, `repeat` and `as`
 */

// template property key names
const nutProps = new Set(['if', 'unless', 'hide', 'show'])
const childProps = new Set(['model', 'repeat', 'as', 'if', 'unless', 'hide', 'show'])
// array methods
const reduce = Array.prototype.reduce
const map = Array.prototype.map

// return a regular object with attributes from a element
function parseAttributes (el) {
  return reduce.call(el.attributes, (obj, i) => {
    obj[i.name] = i.value
    return obj
  }, {})
}

function extractProps (atts, propNames) {
  const props = {}
  propNames.forEach(prop => {
    if (prop in atts) {
      props[prop] = atts[prop]
      delete atts[prop]
    }
  })
  return props
}

function extractEvents (atts) {
  let events = {}
  Object.keys(atts).forEach(k => {
    if (k.startsWith('(') && k.endsWith(')')) {
      events[k.slice(1, k.length - 1)] = atts[k]
      delete atts[k]
    }
  })
  return events
}

/**
 * @param {DOM node} el template tag
 * @param {boolean} rawChildren indicates whether parse children tags. `false` by default
 * @returns {object} parsed tag
 */
function parseTemplate (el, rawChildren) {
  const atts = parseAttributes(el)

  // extract nut name
  const tagName = atts.nut
  if (!tagName) {
    throw new Error('templates requires a name (nut attribute)')
  }
  delete atts.nut

  const src = {
    type: 1,
    localName: el.localName,
    tagName,
    attribs: atts,
    props: extractProps(atts, nutProps)
  }

  // extract events
  const events = extractEvents(atts)
  if (Object.keys(events).length) src.events = events

  if (rawChildren) {
    src.children = el.childNodes
  } else {
    // parse children dom elements
    if (el.childNodes && el.childNodes.length) {
      src.children = map.call(el.childNodes, child => parseChild(child))
    }
  }
  return src
}

/**
 * @param {DOM node} el template tag
 * @returns {object} parsed tag
 */
function parseChild (el) {
  let atts = {}, // attributes
      props = {}

  let src = {
    type: el.nodeType,
    data: el.data,
    localName: el.localName
  }

  if (el.attributes && el.hasAttributes()) {
    // fill `atts` object with element attributes
    atts = parseAttributes(el)

    // extract custom nut properties
    src.props = props = extractProps(atts, childProps)

    const events = extractEvents(atts)
    if (Object.keys(events).length) src.events = events
  }

  src.attribs = atts
  // parse children dom elements
  if (el.childNodes && el.childNodes.length && !props.as) {
    src.children = map.call(el.childNodes, child => parseChild(child))
  }

  return src
}

module.exports = parseTemplate
