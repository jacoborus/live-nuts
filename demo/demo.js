/* globals nuts */

'use strict'

nuts
.addBehaviour('new-task', {
  events: {
    keypress: function (e, nut, box) {
      if (e.which === 13) { // 13 is enter
        box.set('variable', nut.el.value)
      }
    }
  }
})
.resolve(function () {
  console.log('ok!')
  window.n = nuts
  console.log(nuts.model)
})
