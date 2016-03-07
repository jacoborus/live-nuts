/* globals nuts */

'use strict'

nuts
.addBehaviour('app', {
  addTask: function (e, nut) {
    if (e.which === 13) { // 13 is enter
      nut.scope.variable = nut.el.value
      nut.el.value = ''
      nut.save()
    }
  }
})
.resolve(function () {
  console.log('ok!')
  window.n = nuts
  console.log(nuts.model)
})
