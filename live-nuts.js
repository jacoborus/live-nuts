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


var getAttributes = function (atts) {
	//console.log('atts')
	//console.log(atts)
	var len = atts.length,
		obj = {},
		att,
		i;

	while (i < len) {
		console.log(i);
		if (atts.hasOwnProperty( i )) {
			att = atts[i];
			obj[att.nodeName] = att.value;
		}
		i++;
	}
	return obj;
};



/* - Utils */
// detect if an attribute name is prefixed with nu-
var startsWithNu = function (str) {
    return str.indexOf( 'nu-' ) === 0;
};
// remove nu- prefix from attribute
var getNuProp = function (prop) {
    return prop.substr(3, prop.length);
};

var hasProp = function (name, list) {
	var i;
	for (i in list) {
		if (i === name) {
			return true;
		}
	}
	return false;
};

// move attributes with nu- prefix to nuAtts property
var separateNamesakes = function () {
	var names = {},
		sakes = {},
		atts = this.attribs,
		i;

	for (i in atts) {
		if (hasProp( i, this.nuAtts )) {
			names[i] = atts[i];
			sakes[i] = this.nuAtts[i];
			delete atts[i];
			delete this.nuAtts[i];
		}
	}
	this.namesakes = names;
	this.nuSakes = sakes;
};

// move attributes with nu- prefix to nuAtts property
var separateNuAtts = function () {
	var nuAtts = {},
		atts = this.attribs,
		i;

	for (i in atts) {
		if (startsWithNu( i )) {
			nuAtts[ getNuProp( i )] = atts[i];
			delete atts[i];
		}
	}
	this.nuAtts = nuAtts;
};




var TagSchema = function (attributes, dom) {
	var atts = getAttributes( attributes ),
		domChildren, nuChildren, i;

	switch (dom.nodeType) {
		case 1:
			this.type = 'tag';
			break;
		case 3:
			this.type = 'text';
			break;
		case 8:
			this.type = 'comment';
			break;
		case 10:
			this.type = 'directive';
			break;
		default:
			this.type = 'tag';
			break;
	}

	this.data = dom.data;
	this.name = dom.localName;

	// assign attributes
	if (atts) {
		// separate special attributes
		if (atts.class) {
			this.class = atts.class;
			delete atts.class;
		}
		if (atts['nu-class']) {
			this.nuClass = atts['nu-class'];
			delete atts['nu-class'];
		}
		if (atts['nu-scope']) {
			this.scope = atts['nu-scope'];
			delete atts['nu-scope'];
		}
		if (atts['nu-model'] || atts['nu-model'] === '') {
			this.model = atts['nu-model'];
			delete atts['nu-model'];
		}
		if (atts['nu-repeat'] || atts['nu-repeat'] === '') {
			this.repeat = atts['nu-repeat'];
			delete atts['nu-repeat'];
		}
		if (atts['nu-each'] || atts['nu-each'] === '') {
			this.each = atts['nu-each'];
			delete atts['nu-each'];
		}
		if (atts['nu-pipe'] || atts['nu-pipe'] === '') {
			this.pipe = atts['nu-pipe'];
			delete atts['nu-pipe'];
		}
		if (atts['nu-block'] || atts['nu-block'] === '') {
			this.block = atts['nu-block'];
			delete atts['nu-block'];
		}
		if (atts['nu-if'] || atts['nu-if'] === '') {
			if (atts['nu-if']) {
				this.nuif = atts['nu-if'];
			}
			delete atts['nu-if'];
		}
		if (atts['nu-unless'] || atts['nu-unless'] === '') {
			if (atts['nu-unless']) {
				this.unless = atts['nu-unless'];
			}
			delete atts['nu-unless'];
		}
		if (atts['nu-checked'] || atts['nu-checked'] === '') {
			this.checked = atts['nu-checked'];
			delete atts['nu-checked'];
		}
		if (atts['nu-doctype'] === '') {
			this.doctype = true;
			delete atts['nu-doctype'];
		}
		if (atts['nu-as'] || atts['nu-as'] === '') {
			if (atts['nu-as']) {
				this.as = atts['nu-as'];
			}
			delete atts['nu-as'];
		}

		// separate nuAttributes from the regular ones
		separateNuAtts.call( dom );
		separateNamesakes.call( dom );
	}

	// assign children dom elements
	if (dom.children && dom.children.length) {
		this.children = [];
		nuChildren = this.children;
		domChildren = dom.children;
		for (i in domChildren) {
			nuChildren[i] = {
				src : null,
				schema: new TagSchema( domChildren[i].attributes, domChildren[i] )
			};
		}
	}

	// assign attributes
	this.attribs = atts || {};
	this.nuAtts = dom.nuAtts || {};
	this.namesakes = dom.namesakes || {};
	this.nuSakes = dom.nuSakes || {};
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
				src: el.outerHTML,
				schema: new TagSchema( el.attributes, el )
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
