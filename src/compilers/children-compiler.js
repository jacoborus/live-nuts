'use strict'

export default function (children) {
  return (nut, box) => children.forEach(c => {
    nut.el.appendChild(c.render(nut.scope, box))
  })
}
