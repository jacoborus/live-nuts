/* globals nuts */

'use strict'

nuts
.addFilter('titler', x => x + ' titleeeeeeee')
.addBehaviour('input-title', {
  events: {
    keypress: function (e, nut) {
      let key = e.which || e.keyCode
      if (key === 13) { // 13 is enter
        if (nut.element.value.trim()) {
          nut.updateScope('variable', nut.element.value)
        }
      }
    }
  }
})
.addBehaviour('custom-title', {
  events: {
    click: function (event, nut) {
      nut.updateModel('hola')
    }
  }
})
.resolve(function () {
  console.log('ok!')
  console.log(nuts.model)
})
