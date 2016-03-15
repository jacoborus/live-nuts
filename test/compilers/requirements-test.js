'use strict'

import test from 'tape'
import reqs from '../../src/compilers/requirements.js'

test('compile requirements with just if or unless', t => {
  let schemaIf = {
    nuif: 't'
  }
  let reqif = reqs(schemaIf)
  t.ok(reqif({t: 1}), 'true nuif')
  t.notOk(reqif({t: 0}), 'false nuif')

  let schemaUnless = {
    unless: 't'
  }
  let requnless = reqs(schemaUnless)
  t.ok(requnless({t: 0}), 'true unless')
  t.notOk(requnless({t: 1}), 'false unless')

  let schemaAll = {
    unless: 'u',
    nuif: 'i'
  }
  let reqall = reqs(schemaAll)
  t.ok(reqall({u: 0, i: 1}), 'true all')
  t.notOk(reqall({u: 1, i: 0}), 'false all')
  t.notOk(reqall({u: 0, i: 0}), 'false all')
  t.notOk(reqall({u: 1, i: 1}), 'false all')

  t.end()
})

test('compile requirements with just model condition', t => {
  let schema = {
    model: 'm'
  }
  let req = reqs(schema)
  t.ok(req({m: {}}), 'true nuif')
  t.notOk(req({m: 0}), 'false nuif')

  t.end()
})

test('compile requirements with nuif and model', t => {
  let schema = {
    model: 'm',
    nuif: 'i'
  }
  let req = reqs(schema)
  t.ok(req({m: {i: 1}}), 'true all')
  t.notOk(req({m: {}, i: 1}), 'false no nuif')
  t.notOk(req({m: 1, i: 0}), 'false no object as model')
  t.notOk(req({m: 0, i: 1}), 'false no model')
  t.notOk(req({m: 0}), 'false no model no huif')

  t.end()
})
