'use strict';
(function (window) {
var templates = {};

var Nuts = function () {
};

var getNutName = function (atts) {
	var len = atts.length,
		i = 0,
		att;

	while (i < len) {
		att = atts[i];
		if (att.nodeName === 'nut') {
			return att.value;
		}
		i++;
	}
	return false;
};

Nuts.prototype.addTemplate = function (src, callback) {
	var div = document.createElement('div');
	div.innerHTML = src;
	var elems = div.childNodes;

	var i = 0,
		el, name, atts;

	while (i < elems.length) {
		el = elems[i];
		atts = el.attributes;
		name = getNutName( atts );
		if (name) {
			templates[name] = {
				src: el.outerHTML
			};
		}
		i++;
	}
	callback(null);
};







Nuts.prototype.getTemplate = function (name) {
	return templates[name];
};

window.nuts = new Nuts();

})(window);
