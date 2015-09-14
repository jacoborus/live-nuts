'use strict'

describe.skip('Schema:', function () {
  it('has same properties as source when no extension passed', function (done) {
    let nuts = new Nuts()
    nuts.templates = {
      sample: {
        source: {
          scope: 'test'
        }
      }
    }
    nuts.makeSchemas(function (err) {
      expect(err).to.not.be.ok
      expect(nuts.templates.sample.schema.scope).equals('test')
      done()
    })
  })

  it('extend nut properties', function (done) {
    let nuts = new Nuts()
    nuts.templates = {
      sample: {
        source: {
          scope: 'test'
        }
      },
      otherSample: {
        source: {
          scope: 'extension',
          other: 'other'
        }
      }
    }
    nuts.makeSchemas(function (err) {
      expect(err).to.not.be.ok
      expect(nuts.templates.sample.scope).equals('test')
      expect(nuts.templates.sample.other).equals('other')
      done()
    })
  })

  it('extend attributes and variable attributes', function (done) {
    let nuts = new Nuts()
    nuts.templates = {
      sample: {
        source: {
          attribs: { other: 'src' },
          nuAtts: {other: 'src' }
        }
      },
      otherSample: {
        source: {
          attribs: { id: 'ext', other: 'ext' },
          nuAtts: { id: 'ext', other: 'ext' }
        }
      }
    }
    nuts.makeSchemas(function (err) {
      expect(err).to.not.be.ok
      expect(nuts.templates.sample.schema.attribs.id).equals('ext')
      expect(nuts.templates.sample.schema.attribs.other).equals('src')
      expect(nuts.templates.sample.schema.nuAtts.id).equals('ext')
      expect(nuts.templates.sample.schema.nuAtts.other).equals('src')
      done()
    })
  })

  it('extend nutName', function (done) {
    let nuts = new Nuts()
    nuts.templates = {
      sample: {
        source: {
          nutName: 'test'
        }
      },
      otherSample: {
        source: {
          nutName: 'other'
        }
      }
    }
    nuts.makeSchemas(function (err) {
      expect(err).to.not.be.ok
      expect(nuts.templates.sample.schema.nutName).equals('test')
      done()
    })
  })

  it('extend formatters', function (done) {
    let nuts = new Nuts()
    nuts.templates = {
      sample: {
        source: {
          formatters: ['test']
        }
      },
      otherSample: {
        source: {
          formatters: ['other']
        }
      }
    }
    nuts.makeSchemas(function (err) {
      expect(err).to.not.be.ok
      expect(nuts.templates.sample.schema.formatters[0]).equals('test')
      done()
    })
  })
})
