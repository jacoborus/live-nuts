'use strict'

import test from 'tape'
import addFiltersFactory from '../../src/api/add-filters.js'

test('add everyFilter in filtersArchive', function (t) {
  let filtersArchive = new Map()
  let addFilters = addFiltersFactory(filtersArchive, function () {
    t.ok(filtersArchive.has('filterOne'))
    t.ok(filtersArchive.has('filterTwo'))
    let fn = filtersArchive.get('filterOne')
    t.is(fn('-'), '-one')
    t.end()
  })

  addFilters({
    filterOne: value => value + 'one',
    filterTwo: value => value + 'two'
  })
})
