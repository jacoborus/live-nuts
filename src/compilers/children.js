'use strict'

export default function (children) {
  return (scope, box, parentNut) => {
    let list = []
    children.forEach(c => {
      list.push(c.render(scope, box, parentNut))
      /*
       * {
       *   isRendered: boolean,
       *   element: DOMelement,
       *   subscription: function
       * }
       */
    })
    return list
  }
}
