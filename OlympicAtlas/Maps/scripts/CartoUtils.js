/**
A Collection of Cartographic Functions.
<p>Author: Hans Rudolf Bär</p>
<p>Mail: baer@karto.baug.ethz.ch</p>
<p>Date: 2012-6-1</p>

@class CartoUtils
@namespace CARTOUTILS
**/
(function() {
	var _X_ = {};

	if (typeof exports !== 'undefined' && typeof module !== 'undefined' && module.exports) {
		module.exports = _X_;
	}
	else {
		this['CARTOUTILS'] = _X_;
	}

	/**
	The current version.
	
	@property VERSION
	@type String
	@final
	**/
	_X_.VERSION = '0.0.1';
	
	var binarySearch = function(a, v) {
		var h = a.length, l = -1, m;
		while(h - l > 1) {
			if (a[m = h + l >> 1] <= v)
				l = m;
			else
				h = m;
		}
		return h;
	};
	
	/**
	Given an array of break values, this functions returns the index.
	The index refers to the interval such that: a[i] <= v < a[i + 1].
	Make sure that the break values are in ascending order.
	Use function 'reorder' to get a copy the array in ascending order.

	@method classIndex
	@param {Array} a An array of break values
	@param {Number} v The value to look up
	@return {Number} The index of the value
	**/
	_X_.classIndex = binarySearch;
	
	/**
	This function performs a disrete mapping between an array of break value and another array.
	Make sure that the look-up array has one element more than the array of break values.
	This function is useful for instance for color coding.

	@method classValue
	@param {Array} a An array of break values
	@param {Array} c A look-up table
	@param {Number} v The value to look up
	@return {Object} A value of the look-up table
	**/
	_X_.classValue = function(a, c, v) {
		return c[binarySearch(a, v)];
	}
	
	/**
	Returns a copy of the passed array in ascending order.

	@method reorder
	@param {Array} a The array to sort in ascending order
	@return {Array} A copy of the sorted array
	**/
	_X_.reorder = function(a) {
		return a.slice(0).sort(function(x, y) {
			return x - y;
		});
	}
	
	/**
	Converts a query string or the query part of an URL string to a JavaScript object.
	
	@method convertQueryStringToObject
	@param {String} url The URL string
	@return {object} The JavaScript object
	**/
	_X_.convertQueryStringToObject = function(url) {
		var query = url.substr(url.indexOf('?') + 1);
		var object = {};
		var pairs = query.split('&');
		for (var i = 0; i < pairs.length; ++i) {
			var pair = pairs[i];
			var keyValue = pair.split('=');
			if (keyValue.length == 2) {
				object[window.decodeURIComponent(keyValue[0])] = JSON.parse(window.decodeURIComponent(keyValue[1]));
			}
		}
		return object;
	}
	
	/**
	Converts a JavaScript object to a query string.
	
	@method convertObjectToQueryString
	@param {object} object The JavaScript object to convert
	@return {String} The resulting query string
	**/
	_X_.convertObjectToQueryString = function(object) {
		var query = [];
		var keys = Object.keys(object);
		for (var i = 0; i < keys.length; ++i) {
			var key = keys[i];
			var value = window.encodeURIComponent(JSON.stringify(object[key]));
			query.push(window.encodeURIComponent(key) + '=' + value);
		}
		return query.join('&');
	}
	
})();