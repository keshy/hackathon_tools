var parseUrl = require('url').parse;
var _ = require('underscore');

// add startsWith to String prototype
if (typeof String.prototype.startsWith != 'function') {
	String.prototype.startsWith = function(str) {
		return this.indexOf(str) == 0;
	};
}

// add isEmpty to String prototype
if (typeof String.prototype.isEmpty != 'function') {
	String.prototype.isEmpty = function() {
		return (this == null || this.length == 0) ? true : false;
	};
}

// add contains to String prototype
if (typeof String.prototype.contains != 'function') {
	String.prototype.contains = function(str) {
		return (this != null && str != null && this.indexOf(str) !== -1) ? true
				: false;
	};
}

// extract URL parameters for handling http requests
function http_parseUrl(req) {
	var targetUrl = [];
	var parsedURL = parseUrl(req.url);
	targetUrl.handler = parsedURL.pathname.substring(1);
	targetUrl.params = processQueryStringParams(parsedURL.query);
	targetUrl.href = parsedURL.href;
	return targetUrl;
}
exports.parseUrl = http_parseUrl;

// encode string
function strencode(data) {
	return unescape(encodeURIComponent(JSON.stringify(data)));
}
exports.encode = strencode;

// decode string
function strdecode(data) {
	return JSON.parse(decodeURIComponent(escape(data)));
}
exports.decode = strdecode;

// to array function
function lang_toArray(o) {
	if (o === null)
		return new Array();
	if (typeof o === 'object' && typeof o.length !== 'undefined')
		return o;
	return new Array(o);
}
exports.toArray = lang_toArray;

// process query string params
function processQueryStringParams(query) {
	var params = [];
	var temp;
	if (query == null || query.isEmpty()) {
		return null;
	}
	console.log(query);
	if (query.contains('&')) {
		// more than one name-value pair:
		temp = query.split('&');
	} else {
		temp = query;
	}

	for (i in temp) {
		t = temp[i].split('=');
		if (t != null || t.length == 2) {
			if (params != null && params[t[0]] != null) {
				params[t[0]] = params[t[0]].concat(',' + t[1]);
			} else {
				params[t[0]] = t[1];
			}
		}
	}
	return params;
}

exports.processQueryStringParams = processQueryStringParams;