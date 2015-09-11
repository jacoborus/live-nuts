'use strict'

describe('nuts.addTemplate:', function () {
  it('add src to a new template in templates archive', function (done) {
    let nuts = new Nuts(),
        tmpl = '<span nut="one">hello</span>'
    nuts.addTemplates(tmpl, function (err) {
      expect(err).to.not.be.ok
      expect(nuts.templates.one.raw).to.equal('<span nut="one">hello</span>')
      done()
    })
  })

  it('add several templates from a single string', function (done) {
    let nuts = new Nuts(),
        tmpl = '<span nut="three">hello</span><span nut="four">hello</span>'
    nuts.addTemplates(tmpl, function (err) {
      expect(err).to.not.be.ok
      expect(nuts.templates.three.raw).to.equal('<span nut="three">hello</span>')
      expect(nuts.templates.four.raw).to.equal('<span nut="four">hello</span>')
      done()
    })
  })
})
