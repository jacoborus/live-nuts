/* globals nuts */

'use strict'

nuts
.addBehaviour('app', {
  init: function (nut) {},
  addTask: function (e, nut) {
    if (e.which === 13) { // 13 is enter
      nut.scope.variable = nut.scope.new_task
    }
  },
  _aFactoryMethod: nut => {
    return val => nut.scope.value = val
  }
})
.resolve(function () {
  console.log('ok!')
  window.n = nuts
  console.log(nuts.model)
})
