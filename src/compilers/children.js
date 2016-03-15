'use strict'

import reqs from './requirements.js'

export default function (children) {
  return (scope, box, nut, el) => {
    let list = []
    children.forEach(schema => {
      let req = reqs(schema)
      let subscription = () => 5
      list.push({
        req,
        schema,
        subscription,
        el: null,
        render: schema.render
      })
      /*
       * {
       *   isRendered: boolean,
       *   element: DOMelement,
       *   subscription: function
       * }
       */
    })
    list.forEach(v => {
      if (!v.req || v.req(scope)) {
        let elem = v.render(scope, box, nut)
        el.appendChild(elem)
      }
      if (v.subscribe) {
        box.subscribe(v.subscription)
      }
    })
  }
}
