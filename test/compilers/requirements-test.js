'use strict'

const test = require('tape')
const reqs = require('../../src/compilers/requirements.js')

test('always return true if no conditions', t => {
  let schema = {}
  let req = reqs(schema)
  t.is(req(), true)
  t.end()
})

test('whether', t => {
  let schema = {
    whether: 'tt'
  }
  let req = reqs(schema)
  t.ok(req({tt: true}))
  t.notOk(req({tt: false}))
  t.end()
})

test('model', t => {
  let schema = {
    model: 'tt'
  }
  let req = reqs(schema)
  t.ok(req({tt: {}}))
  t.notOk(req({}))
  t.end()
})

test('if', t => {
  let schema = {
    if: 'tt'
  }
  let req = reqs(schema)
  t.ok(req({tt: true}))
  t.notOk(req({tt: false}))
  t.notOk(req({}))
  t.end()
})

test('whether model', t => {
  let schema = {
    whether: 'ww',
    model: 'mm'
  }
  let req = reqs(schema)
  t.ok(req({ww: true, mm: {}}))
  t.notOk(req({ww: false, mm: {}}))
  t.notOk(req({mm: {}}))
  t.notOk(req({ww: true, mm: false}))
  t.notOk(req({}))
  t.end()
})

test('whether if', t => {
  let schema = {
    whether: 'ww',
    if: 'ii'
  }
  let req = reqs(schema)
  t.ok(req({ww: true, ii: {}}))
  t.notOk(req({ww: false, ii: {}}))
  t.notOk(req({ii: {}}))
  t.notOk(req({ww: true, ii: false}))
  t.notOk(req({}))
  t.end()
})

test('model if', t => {
  let schema = {
    model: 'mm',
    if: 'ii'
  }
  let req = reqs(schema)
  t.ok(req({mm: {}}))
  t.notOk(req({}))
  t.end()
})

test('whether model if', t => {
  let schema = {
    model: 'mm',
    if: 'ii',
    whether: 'ww'
  }
  let req = reqs(schema)
  t.ok(req({ww: true, mm: {}}))
  t.notOk(req({ww: false, mm: {}}))
  t.notOk(req({mm: {}}))
  t.notOk(req({ww: true, mm: false}))
  t.notOk(req({}))
  t.end()
})
