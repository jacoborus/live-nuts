/*globals it describe chai*/
'use strict'

var expect,
  require = require || function () {},
  nuts = nuts || require('../live-nuts.js')

if (typeof chai !== 'undefined' && chai !== null) {
  expect = chai.expect
} else {
  expect = require('chai').expect
}

describe('Scope', function () {
  it('render simple data', function () {
    var tmpl = '<span nut="simpleData" nu-model="word">hi</span>'
    nuts.addTemplate(tmpl, function () {
      expect(
        nuts.render('simpleData', { word: 'bye' }).outerHTML
     ).to.equal('<span>bye</span>')
    })
  })

  it('render data inside inner tags', function () {
    var tmpl = '<ul nut="dataThrough"><li nu-model="word">hi</li></ul>'
    nuts.addTemplate(tmpl, function () {
      expect(
        nuts.render('dataThrough', { word: 'bye' }).outerHTML
     ).to.equal('<ul><li>bye</li></ul>')
    })
  })

  it('render data passed through scope', function () {
    var tmpl = '<ul nut="basicScope" nu-scope="card"><li nu-model="name">no name</li></ul>'
    nuts.addTemplate(tmpl, function () {
      expect(
        nuts.render('basicScope', { card: { name: 'Name' }}).outerHTML
     ).to.equal('<ul><li>Name</li></ul>')
    })
  })

  it('use children dom elem if there is no model in data', function () {
    var tmpl = '<ul nut="defaultChildrenScope" nu-scope="card"><li nu-model="name">no name</li></ul>'
    nuts.addTemplate(tmpl, function () {
      expect(
        nuts.render('defaultChildrenScope', { card: { }}).outerHTML
     ).to.equal('<ul><li>no name</li></ul>')
    })
  })

  it('render data passed through multiple scopes', function () {
    var tmpl = '<div  nut="doubleScope">'
      + '<ul nu-scope="card">'
      + '<li nu-model="name">no name</li>'
      + '</ul></div>'
    nuts.addTemplate(tmpl, function () {
      expect(
        nuts.render('doubleScope', { card: { name: 'Name' }}).outerHTML
     ).to.equal('<div><ul><li>Name</li></ul></div>')
    })
  })

  it('render className from data', function () {
    var tmpl = '<span nut="classData" class="featured" nu-class="nuclass">bye</span>'
    nuts.addTemplate(tmpl, function () {
      expect(
        nuts.render('classData', {nuclass: 'white'}).outerHTML
     ).to.equal('<span class="featured white">bye</span>')
    })
  })

  it('render attributes with namesake', function () {
    var tmpl = '<span nut="nuSakes" id="id" nu-id="nuid"></span>'
    nuts.addTemplate(tmpl, function () {
      expect(
        nuts.render('nuSakes', {nuclass: 'white'}).outerHTML
     ).to.equal('<span id="nuid"></span>')
    })
  })

  it('render attributes from data', function () {
    var tmpl = '<span nut="nuAtts" nu-id="color"></span>'
    nuts.addTemplate(tmpl, function () {
      expect(
        nuts.render('nuAtts', {color: 'white'}).outerHTML
     ).to.equal('<span id="white"></span>')
    })
  })

  it('Inserts the element only when the value evaluates to true', function () {
    var tmpl = '<span nut="nuif" nu-if="color">hi</span>'
    nuts.addTemplate(tmpl, function () {
      expect(
        nuts.render('nuif', {color: true}).outerHTML
     ).to.equal('<span>hi</span>')
      expect(
        nuts.render('nuif')
     ).to.equal('')
    })
  })
})
