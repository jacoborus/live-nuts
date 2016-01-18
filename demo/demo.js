/* globals nuts */

'use strict'

nuts
.addBehaviour('input-title', {
  events: {
    keypress: function (e, nut) {
      let key = e.which || e.keyCode
      if (key === 13) { // 13 is enter
        if (nut.element.value) {
          nut.updateScope('variable', nut.element.value)
        }
      }
    }
  }
})
.addBehaviour('custom-title', {
  events: {
    click: function (event, nut) {
      if (nut.getScope()[nut.schema.model] === 'hola') {
        nut
        .updateScope('variable', 'adios')
        .updateScope('bool', true)
      } else {
        nut
        .updateScope('variable', 'hola')
        .updateScope('bool', false)
      }
    }
  }
})
.resolve(function () {
  console.log('ok!')
  console.log(nuts.model)
})
