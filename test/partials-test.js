'use strict'

const makePartials = require('../src/partials.js'),
      test = require('tape')

test('extend nuts', function (t) {
  let templates = {
    list: {
      key: 'list',
      repeat: 'articles',
      children: [{
        unless: 'mark'
      }, {
        nuif: 'mark'
      }]
    },
    newlist: {
      key: 'newlist',
      scope: 'desc',
      as: 'list'
    }
  }

  let newlist = templates['newlist'],
      list = templates['list']

  makePartials(templates, function () {
    // extend target
    t.is(newlist.repeat, 'articles')
    t.is(newlist.scope, 'desc')
    t.is(newlist.key, 'newlist')
    t.is(newlist.as, undefined)
    t.is(newlist.children[0].unless, 'mark')
    t.is(newlist.children[1].nuif, 'mark')
    // leave extension
    t.is(list.repeat, 'articles')
    t.is(list.scope, undefined)
    t.is(list.key, 'list')
    t.is(list.as, undefined)
    t.end()
  })
})

test('extend nuts recursive', function (t) {
  let templates = {
    list: {
      key: 'list',
      repeat: 'articles',
      children: [{
        unless: 'mark'
      }, {
        nuif: 'mark'
      }]
    },
    newlist: {
      key: 'newlist',
      scope: 'desc',
      as: 'list'
    },
    relist: {
      key: 'relist',
      as: 'newlist',
      class: 'reclass',
      children: [{
        attribs: {
          test: 'test'
        }
      }]
    }

  }

  let newlist = templates['newlist'],
      relist = templates['relist'],
      list = templates['list']

  makePartials(templates, function () {
    // top extend
    t.is(relist.repeat, 'articles')
    t.is(relist.scope, 'desc')
    t.is(relist.key, 'relist')
    t.is(relist.as, undefined)
    t.is(relist.class, 'reclass')
    t.is(relist.children[0].attribs.test, 'test')
    t.notOk(relist.children[1])
    // middle extend
    t.is(newlist.repeat, 'articles')
    t.is(newlist.scope, 'desc')
    t.is(newlist.key, 'newlist')
    t.is(newlist.as, undefined)
    t.is(newlist.children[0].unless, 'mark')
    t.is(newlist.children[1].nuif, 'mark')
    // no extend
    t.is(list.repeat, 'articles')
    t.is(list.scope, undefined)
    t.is(list.key, 'list')
    t.is(list.as, undefined)
    t.end()
  })
})

test('extend children of nuts recursive', function (t) {
  let templates = {
    list: {
      key: 'list',
      repeat: 'articles',
      children: [{
        unless: 'mark',
        as: 'relist'
      }, {
        nuif: 'mark',
        children: [{
          class: 'testclass',
          children: [{
            class: 'grandchildren',
            as: 'relist'
          }]
        }]
      }]
    },
    newlist: {
      key: 'newlist',
      scope: 'desc',
      as: 'list'
    },
    relist: {
      key: 'relist',
      as: 'newlist',
      class: 'reclass',
      children: [{
        attribs: {
          test: 'test'
        }
      }]
    }

  }

  let newlist = templates['newlist'],
      relist = templates['relist'],
      list = templates['list']

  makePartials(templates, function () {
    t.is(relist.repeat, 'articles')
    t.is(relist.scope, 'desc')
    t.is(relist.key, 'relist')
    t.is(relist.as, undefined)
    t.is(relist.class, 'reclass')
    t.is(relist.children[0].attribs.test, 'test')
    t.notOk(relist.children[1])

    t.is(newlist.repeat, 'articles')
    t.is(newlist.scope, 'desc')
    t.is(newlist.key, 'newlist')
    t.is(newlist.as, undefined)
    t.is(newlist.children[0].unless, 'mark')
    t.is(newlist.children[1].nuif, 'mark')

    t.is(list.repeat, 'articles')
    t.is(list.scope, undefined)
    t.is(list.key, 'list')
    t.is(list.as, undefined)
    t.is(list.children[0].scope, 'desc')
    t.is(list.children[1].children[0].class, 'testclass')
    t.is(list.children[1].children[0].children[0].class, 'grandchildren')
    t.is(list.children[1].children[0].children[0].scope, 'desc')
    t.end()
  })
})
