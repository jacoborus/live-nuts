'use strict'

function render (schema, scope) {
  let element
  if (schema.type === 'tag') {
    element = document.createElement(schema.name)
  }
  if (schema.model !== undefined) {
    if (schema.model) {
      element.innerText = scope[schema.model]
    } else {
      element.innerText = scope
    }
  }
  return element
}

function addBindings (bindings, element) {
  for (let i in bindings) {
    element.addEventListener(i, bindings[i], false)
  }
}

let allLinks = new Map()

function addLinks (instance) {
  let scope = instance.scope
  allLinks.has(scope) || allLinks.set(scope, new Map())
  let scopeLinks = allLinks.get(scope),
      modelName = instance.schema.model
  if (modelName !== null) {
    scopeLinks.has(modelName) || scopeLinks.set(modelName, new Set())
    let valueLinks = scopeLinks.get(modelName)
    valueLinks.add(instance)
  }
}

function instantiate (schema, scope) {
  let links = new Set(),
      element = render(schema, scope),
      instance = { scope, schema, element, links }

  addLinks(instance)
  if (schema.bindings) addBindings(schema.bindings, element)
  if (schema.children) {
    schema.children.forEach(childSchema => {
      element.appendChild(instantiate(childSchema, scope).element)
    })
  }
  return instance
}

export default instantiate
