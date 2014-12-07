'use strict';
(function () {

var expect = chai.expect;

var bulkElem = function () {
	var el = document.createElement( 'div' );
	el.setAttribute( 'name', 'bulkElem');
	return el;
};

describe( 'nuts.addTemplate', function () {

	it('add src to a new template in templates archive', function (done) {
		var tmpl = '<span nut="one">hello</span>';
		nuts.addTemplate( tmpl, function (err) {
			expect( err ).to.equal( null );
			expect( nuts.getTemplate('one').src ).to.equal( '<span nut="one">hello</span>' );
			done();
		});
	});

	it('add several templates from a single string', function (done) {
		var tmpl = '<span nut="three">hello</span><span nut="four">hello</span>';
		nuts.addTemplate( tmpl, function (err) {
			expect( err ).to.equal( null );
			expect( nuts.getTemplate('three').src ).to.equal( '<span nut="three">hello</span>' );
			expect( nuts.getTemplate('four').src ).to.equal( '<span nut="four">hello</span>' );
			done();
		});
	});
});


})();
