'use strict'

const extend = require('../src/extend.js')
const test = require('tape')

test('extend localName properties', function (t) {
  let src = {localName: 'srcLocal', props: {}}
  let ext = {localName: 'extLocal', props: {}}

  extend(src, ext, function () {
    t.is(src.localName, 'extLocal')
    t.end()
  })
})

test('extend tag attributes', function (t) {
  let sample = {
    attribs: { other: 'src' },
    props: {}
  }
  let otherSample = {
    attribs: { id: 'ext', other: 'ext' },
    props: {}
  }

  extend(sample, otherSample, function () {
    t.is(sample.attribs.id, 'ext')
    t.is(sample.attribs.other, 'src')
    t.end()
  })
})

test('extend "if" property', function (t) {
  let src = {props: {}}
  let ext = {props: {
    if: 'test'
  }}

  extend(src, ext, function () {
    t.is(src.props.if, 'test')
    let src2 = {props: {
      if: 'no'
    }}
    let ext2 = {props: {
      if: 'test'
    }}

    extend(src2, ext2, function () {
      t.is(src2.props.if, 'no')
      t.end()
    })
  })
})

test('extend events', function (t) {
  let src = {
    events: { click: 'src' },
    props: {}
  }
  let ext = {
    events: { click: 'ext', other: 'ext' },
    props: {}
  }

  extend(src, ext, function () {
    t.is(src.events.click, 'src')
    t.is(src.events.other, 'ext')
    t.end()
  })
})
