/* globals nuts */

'use strict'

nuts
.addBehaviour('input-title', {
  events: {
    keypress: function (e, nut) {
      let key = e.which || e.keyCode
      if (key === 13) { // 13 is enter
        if (nut.element.value) {
          nut.scope.variable = nut.element.value
        }
      }
    }
  }
})
.addBehaviour('custom-title', {
  events: {
    click: function (event, nut) {
      if (nut.scope.variable === 'hola') {
        nut.scope.variable = 'adios'
        nut.scope.bool = true
      } else {
        nut.scope.variable = 'hola'
        nut.scope.bool = false
      }
    }
  }
})
.resolve(function () {
  console.log('ok!')
  console.log(nuts.model)
})
