/* globals nuts */

'use strict'

nuts
.addBehaviour('input-title', {
  events: {
    keypress: function (e, nut, box) {
      let key = e.which || e.keyCode
      if (key === 13) { // 13 is enter
        if (nut.element.value) {
          box.set('variable', nut.element.value)
          console.log(box.get())
        }
      }
    }
  }
})
.addBehaviour('custom-title', {
  events: {
    click: function (event, nut, box) {
      if (box.get().variable === 'hola') {
        box.set('variable', 'adios')
        box.set('bool', true)
      } else {
        box.set('variable', 'hola')
        box.set('bool', false)
      }
      console.log(box.get())
    }
  }
})
.resolve(function () {
  console.log('ok!')
  window.n = nuts
  console.log(nuts.model)
})
