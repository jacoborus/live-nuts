/* globals nuts */

'use strict'

nuts
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
      if (nut.getScope()[nut.schema.model] === 'hola') {
        nut.updateModel('adios')
      } else {
        nut.updateModel('hola')
      }
    }
  }
})
.resolve(function () {
  console.log('ok!')
  console.log(nuts.model)
})
