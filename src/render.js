'use strict'

// 1. create an instance from a schema and a model
// 2. create an element (document fragment) into instance
// 3. add bindings to element
// 4. create model links
// 5. render children

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

let links = new Map()
function addLinks (instance, scope) {
  links.has(scope) || links.set(scope, new Map())
  let scopeLinks = links.get(scope),
      modelName = instance.schema.model
  if (modelName !== null) {
    scopeLinks.has(modelName) || scopeLinks.set(modelName, new Set())
    let valueLinks = scopeLinks.get(modelName)
    valueLinks.add(instance)
  }
}

function instantiate (nut, scope) {
  let links = new Set(),
      element = render(nut, scope),
      instance = { scope, schema: nut, element, links }

  addLinks(instance, scope)
  if (nut.bindings) addBindings(nut.bindings, element)
  if (nut.children) {
    nut.children.forEach(childSchema => {
      element.appendChild(instantiate(childSchema, scope).element)
    })
  }
  return instance
}

export default instantiate
