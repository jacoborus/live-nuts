'use strict'

const reqs = require('./requirements.js')

module.exports = function (children) {
  return (scope, box, nut, el) => {
    let subscriptions = []
    function update () {
      subscriptions.forEach(s => s())
    }
    let list = []
    children.forEach((schema, i) => {
      let req = reqs(schema)
      let subscription = () => 5
      list.push({
        req,
        schema,
        subscription,
        el: null,
        render: schema.render,
        position: i
      })
    })

    list.forEach(v => {
      if (!v.req || v.req(scope)) {
        let elem = v.render(scope, box, nut)
        el.appendChild(elem)
        subscriptions.push(v.subscription)
      }
    })
    box.subscribe(update, scope)
  }
}
