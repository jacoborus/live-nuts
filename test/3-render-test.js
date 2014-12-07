'use strict';


var expect,
	require = require || function () {},
	nuts = nuts || require('../live-nuts.js');


if (typeof chai !== 'undefined' && chai !== null) {
	expect = chai.expect;
} else {
	expect = require('chai').expect;
}

var nuts = nuts || require('../live-nuts.js');


describe( 'nuts.render:', function () {

	it('render simple tags', function (done) {
		var tmpl = '<span nut="simpleTag"></span>';
		nuts.addTemplate( tmpl, function (err) {
			expect( err ).to.equal( null );
			expect( nuts.render( 'simpleTag', {} ).outerHTML ).to.equal( '<span></span>' );
			done();
		});
	});

	it('render simple tag and text nodes', function (done) {
		var tmpl = '<span nut="simpleTagText">hola</span>';
		nuts.addTemplate( tmpl, function (err) {
			expect( err ).to.equal( null );
			expect( nuts.render( 'simpleTagText', {} ).outerHTML ).to.equal( '<span>hola</span>' );
			done();
		});
	});

	it('render comment nodes', function (done) {
		var tmpl = '<span nut="tmplComment"><!--this is a comment--></span>';
		nuts.addTemplate( tmpl, function (err) {
			expect( err ).to.equal( null );
			expect( nuts.render( 'tmplComment', {} ).outerHTML ).to.equal(
				'<span><!--this is a comment--></span>'
			);
			done();
		});
	});

	it('render through simple scope', function () {
		var tmpl = '<ul nut="simpleScope"><li>hola</li></ul>';
		nuts.addTemplate( tmpl, function () {
			expect( nuts.render( 'simpleScope', {} ).outerHTML).to.equal( '<ul><li>hola</li></ul>' );
		});
	});

	it('render regular attributes', function () {
		var tmpl = '<span nut="regularAttribs" id="id" other="other"></span>';
		nuts.addTemplate( tmpl, function () {
			expect(
				nuts.render('regularAttribs').outerHTML
			).to.equal( '<span id="id" other="other"></span>' );
		});
	});

	it('render simple className', function () {
		var tmpl = '<span nut="simpleClass" class="featured"></span>';
		nuts.addTemplate( tmpl, function () {
			expect(
				nuts.render('simpleClass').outerHTML
			).to.equal( '<span class="featured"></span>' );
		});
	});

/*
	it('render doctype', function (done) {
		var tmpl = '<html nut="doctype" nu-doctype></html>';
		nuts.addTemplate( tmpl, function () {
			expect(
				nuts.render('doctype').outerHTML
			).to.equal( '<!DOCTYPE html><html></html>' );
			done();
		});
	});
*/

	it('render checked', function (done) {
		var tmpl = '<input nut="checked" type="radio" name="name" value="value" nu-scope="nuscope" nu-checked>';
		nuts.addTemplate( tmpl, function () {
			expect(
				nuts.render('checked', {nuscope:true}).checked
			).to.equal( true );
			done();
		});
	});


	it('render checked scoped', function (done) {
		var tmpl = '<input nut="checkedScope" type="radio" name="name" value="value" nu-checked="nuscope">';
		nuts.addTemplate( tmpl, function () {
			expect(
				nuts.render('checkedScope', {nuscope:true}).checked
			).to.equal( true );
			done();
		});
	});
});
