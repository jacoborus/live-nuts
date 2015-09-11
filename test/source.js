'use strict'

describe('Template source:', function () {
  it('generate a source from template string', function (done) {
    let nuts = new Nuts(),
        tmpl = '<ul nut="simpleTag"></ul>'
    nuts.addTemplates(tmpl, function (err) {
      expect(err).to.not.be.ok
      expect(nuts.templates.simpleTag.source.type).to.equal('tag')
      expect(nuts.templates.simpleTag.source.name).to.equal('ul')
      done()
    })
  })

  it('separate nuts attributes from regular ones', function (done) {
    let nuts = new Nuts(),
        tmpl = '<span id="id" nu-att="nuid" nut="separateAtts">hello</span>'
    nuts.addTemplates(tmpl, function (err) {
      expect(err).to.not.be.ok
      expect(nuts.templates.separateAtts.source.attribs.id).to.equal('id')
      expect(nuts.templates.separateAtts.source.nuAtts.att).to.equal('nuid')
      done()
    })
  })

  it('distribute special nuts attributes', function (done) {
    let nuts = new Nuts(),
        tmpl = '<span ' +
          ' class="class"' +
          ' nu-class="nuclass"' +
          // scopes
          ' nu-scope="scope"' +
          ' nu-model="model"' +
          ' nu-inherit="inherit"' +
          // conditionals
          ' nu-if="if"' +
          ' nu-unless="unless"' +
          // iterations
          ' nu-repeat="repeat"' +
          ' nu-each="each"' +
          // layouts
          ' nu-layout="layout"' +
          ' nu-block="head"' +
          ' nu-extend="extend"' +
          ' nu-as="nuas"' +
          ' nut="specialNuts"' +
          // regular attributes
          ' myatt="myatt"' +
          ' custom="custom"' +
          // variable attribute
          ' nu-custom="custom"' +
          '>' +
          'hello' +
          '</span>'
    nuts.addTemplates(tmpl, function (err) {
      expect(err).to.not.be.ok
      // class
      expect(nuts.templates.specialNuts.source.class).to.equal('class')
      expect(nuts.templates.specialNuts.source.nuAtts.class).to.not.exist
      // nuClass
      expect(nuts.templates.specialNuts.source.nuClass).to.equal('nuclass')
      // scope
      expect(nuts.templates.specialNuts.source.scope).to.equal('scope')
      expect(nuts.templates.specialNuts.source.nuAtts.scope).to.not.exist
      // model
      expect(nuts.templates.specialNuts.source.model).to.equal('model')
      expect(nuts.templates.specialNuts.source.nuAtts.model).to.not.exist
      // inherit
      expect(nuts.templates.specialNuts.source.inherit).to.equal('inherit')
      expect(nuts.templates.specialNuts.source.nuAtts.inherit).to.not.exist
      // nuif
      expect(nuts.templates.specialNuts.source.nuif).to.equal('if')
      expect(nuts.templates.specialNuts.source.nuAtts.nuif).to.not.exist
      // unless
      expect(nuts.templates.specialNuts.source.unless).to.equal('unless')
      expect(nuts.templates.specialNuts.source.nuAtts.unless).to.not.exist
      // repeat
      expect(nuts.templates.specialNuts.source.repeat).to.equal('repeat')
      expect(nuts.templates.specialNuts.source.nuAtts.repeat).to.not.exist
      // each
      expect(nuts.templates.specialNuts.source.each).to.equal('each')
      expect(nuts.templates.specialNuts.source.nuAtts.each).to.not.exist
      // as
      expect(nuts.templates.specialNuts.source.as).to.equal('nuas')
      expect(nuts.templates.specialNuts.source.nuAtts.as).to.not.exist
      // nut keyname
      // expect(nuts.templates.specialNuts.source.nutName).to.equal('specialNuTs')
      expect(nuts.templates.specialNuts.source.nuAtts.nut).to.not.exist
      // regular attributes
      expect(nuts.templates.specialNuts.source.attribs.myatt).to.equal('myatt')
      // variable attributes
      expect(nuts.templates.specialNuts.source.nuAtts.custom).to.equal('custom')
      done()
    })
  })

  it('add boolean attributes to schema', function (done) {
    let nuts = new Nuts(),
        tmpl = '<span nut="booleans" nu-bool-="myboolean">hello</span>'
    nuts.addTemplates(tmpl, function (err) {
      expect(err).to.not.be.ok
      expect(nuts.templates.booleans.source.booleans.bool).to.equal('myboolean')
      done()
    })
  })

  it('detect void elements', function (done) {
    let nuts = new Nuts(),
        tmpl = '<input nut="voidelem">'
    nuts.addTemplates(tmpl, function (err) {
      expect(err).to.not.be.ok
      expect(nuts.templates.voidelem.source.voidElement).to.equal(true)
      done()
    })
  })

  it('detect formatters', function (done) {
    let nuts = new Nuts(),
        tmpl = '<input nut="formatTag" nu-model=" model | format | other ">'
    nuts.addTemplates(tmpl, function (err) {
      expect(err).to.not.be.ok
      expect(nuts.templates.formatTag.source.formatters[0]).to.equal('format')
      expect(nuts.templates.formatTag.source.formatters[1]).to.equal('other')
      done()
    })
  })
})
