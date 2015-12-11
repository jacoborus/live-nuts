/* globals nuts */

'use strict'

nuts
.addFilter('titler', x => x + ' titleeeeeeee')
.addBehaviour('my-template', {
  init: function (nut) {
    if (nut.scope.current) {
      // do something
    }
  },
  exit: function () {},
  on: {
    click: (nut, event) => {
      event.preventDefault()
      nut.set('current', false)
      nut.methodOne()
    }
  },
  children: {
    title: {
      init: nut => {
        if (nut.get('current')) console.log('activo!')
      }
    }
  },
  methods: {
    methodOne: function () {}
  }
})
.resolve(function () {
  console.log('vamosssssssssss')
})
