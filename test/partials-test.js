'use strict'

const makePartials = require('../src/partials.js')
const test = require('tape')

test('extend nuts recursive', function (t) {
  let schemas = new Map()
  .set('list', {
    tagName: 'list',
    children: [{
      localName: 'newlist',
      unless: 'mark'
    }, {
      nuif: 'mark'
    }]
  })
  .set('newlist', {
    tagName: 'newlist',
    attribs: {
      test: 'newlist'
    },
    children: [{
      localName: 'relist'
    }]
  })
  .set('relist', {
    tagName: 'relist',
    attribs: {
      test: 'relist'
    }
  })

  let list = schemas.get('list')
  let newlist = schemas.get('newlist')

  makePartials(schemas, function () {
    t.is(list.children[0].attribs.test, 'newlist')
    t.is(list.children[0].children[0].attribs.test, 'relist')
    t.is(newlist.children[0].attribs.test, 'relist')
    t.end()
  })
})

test('make circular partials', function (t) {
  let schemas = new Map()
  .set('list', {
    tagName: 'list',
    localName: 'span',
    attribs: {
      test: 'listparent'
    },
    children: [{
      localName: 'relist',
      attribs: {
        test: 'listchildren'
      }
    }]
  })
  .set('relist', {
    tagName: 'relist',
    localName: 'p',
    attribs: {
      test: 'relistparent',
      other: 'other'
    },
    children: [{
      localName: 'list',
      attribs: {
        test: 'relistchildren'
      }
    }]
  })

  let list = schemas.get('list')
  let relist = schemas.get('relist')

  makePartials(schemas, function () {
    t.is(list.children[0].attribs.test, 'listchildren')
    t.is(list.children[0].attribs.other, 'other')
    t.is(relist.children[0].attribs.test, 'relistchildren')
    t.is(list.children[0].children[0].attribs.test, 'relistchildren')
    t.is(relist.children[0].children[0].attribs.test, 'listchildren')
    t.end()
  })
})
