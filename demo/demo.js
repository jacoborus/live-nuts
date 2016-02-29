/* globals nuts */

'use strict'

nuts
.addBehaviour('new-task', {
  events: {
    keypress: function (e, nut, box) {
      if (e.which === 13) { // 13 is enter
        box.get().variable = nut.el.value
        box.save()
      }
    }
  }
})
.resolve(function () {
  console.log('ok!')
  window.n = nuts
  console.log(nuts.model)
})
