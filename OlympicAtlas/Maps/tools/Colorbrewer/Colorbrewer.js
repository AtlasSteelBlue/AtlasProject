"use strict";

$.i18n.init({ fallbackLng: 'en', useLocalStorage: false, debug: false }, function() {
	console.log($.t('app.copyright'));
	console.log($.t('app.email'));
	$(document).i18n();
});

$(document).ready(function() {
	console.log('ready');
	var FILETYPE = 'application/octet-stream';
	
	function Color(v) {
		function cmp(p) {
			return parseInt(v.substr(p, 2), 16) / 255;
		}
		var rgb = { r: cmp(0), g: cmp(2), b: cmp(4) };
		this.toString = function() {
			return [rgb.r, rgb.g, rgb.b].map(function(element) {
				return element.toFixed(3);
			}).join(', ');
		}
		this.rgb = rgb;
	}
	
	function RGB255(clr) {
		function v255(v) {
			return Math.round(v * 255);
		}
		this.toString = function() {
			var c = clr.rgb;
			return [c.r, c.g, c.b].map(function(element) {
				return v255(element);
			}).join(', ');
		}
	}
	
	function HSL(clr) {
		function convert() {
			var c = clr.rgb;
			var max = Math.max(c.r, c.g, c.b);
			var min = Math.min(c.r, c.g, c.b);
			var sum = max + min;
			var dif = max - min;
			var l = sum / 2 ;
			var s = 0, h = 0;
			if (max != min) {
				s = l < 0.5 ? dif / sum : dif / (2.0 - sum);
				if (c.r == max) {
					h = (c.g - c.b) / dif;
				}
				else if (c.g == max) {
					h = 2.0 + (c.b - c.r) / dif;
				}
				else {
					h = 4.0 + (c.r - c.g) / dif;
				}
			}
			return [60 * (h < 0 ? h + 6 : h), 100 * s, 100 * l];
		}
		this.toString = function() {
			return convert().map(function(element) {
				return Math.round(element);
			}).join(', ');
		}
	}
	
	function HSV(clr) {
		function convert() {
			var c = clr.rgb;
			var min = Math.min(c.r, c.g, c.b);
			var max = Math.max(c.r, c.g, c.b);
			var delta = max - min;
			var h = 0, s = 0, v = max;
			if (delta != 0) {
				s = delta / max;
				var del_R = (((max - c.r) / 6) + (delta / 2)) / delta;
				var del_G = (((max - c.g) / 6) + (delta / 2)) / delta;
				var del_B = (((max - c.b) / 6) + (delta / 2)) / delta;
				if (c.r == max) { h = del_B - del_G; }
				else if (c.g == max) { h = (1 / 3) + del_R - del_B; }
				else if (c.b == max) { h = (2 / 3) + del_G - del_R; }
				if (h < 0) { h += 1; }
				if (h > 1) { h -= 1; }
			}
			return [h * 360, s * 100, v * 100];
		}
		this.toString = function() {
			var hsv = convert();
			return hsv.map(function(element) {
				return Math.round(element);
			}).join(', ');
		}
	}
	
	function CMYK(clr) {
		function convert() {
			var rgb = clr.rgb;
			var k = 1 - Math.max(rgb.r, rgb.g, rgb.b);
			var c = 0, m = 0, y = 0;
			if (k < 1) {
				var c = (1 - rgb.r - k) / (1 - k);
				var m = (1 - rgb.g - k) / (1 - k);
				var y = (1 - rgb.b - k) / (1 - k);
			}
			var cmyk = [c, m, y, k];
			return cmyk.map(function(element) {
				return 100 * element;
			})
		}
		this.toString = function() {
			var cmyk = convert();
			return cmyk.map(function(element) {
				return Math.round(element);
			}).join(', ');
		}
	}
	
	$('#numClasses').on('change', function(evt) {
		init();
	});
	
	$('#classType').on('change', function(evt) {
		var schemes = $('.schemes');
		schemes.empty();
		var selection = brewercolors[$(this).attr('value')];
		var index = $('#numClasses').val() - 3;
		$.each(selection, function(indexInArray, valueOfElement) {
			var schemeType = selection[indexInArray];
			var scheme = schemeType[index];
			if (scheme) {
				var div = $('<div/>').attr({ id: indexInArray, title: indexInArray, tabindex: 0, draggable: true }).addClass('scheme');
				for (var i in scheme) {
					var color = scheme[i];
					$('<div/>').addClass('box').css('background-color', '#' + color).appendTo(div);
				}
				div.on('focus', function(evt) {
					showColorValues(indexInArray, scheme);
					var clrstr = indexInArray + ': ' + scheme.join(', ');
					window.top.postMessage({ method: 'setColorArray', colorArray: clrstr }, '*');
				})
				div.on('dragstart', function(evt) {
					var clrstr = indexInArray + ': ' + scheme.join(', ');
					evt.originalEvent.dataTransfer.setData("text/plain", clrstr);
					evt.originalEvent.dataTransfer.setData("text/html", $(evt.currentTarget).html());
					var uri = FILETYPE + ':' + indexInArray + '.act:' + getColorTableURI(scheme);
					evt.originalEvent.dataTransfer.setData('DownloadURL', uri);
					return true;
				})
				div.on('drag', function(evt) {
					return false;
				})
				div.on('dragend', function(evt) {
					return true;
				})
				schemes.append(div);
			}
		})
		if (schemes.children().size() == 0) {
			schemes.text('No color schemes match these criteria.');
		}
	});
	
	function init() {
		$('#classType').trigger('change');
	}
	
	function showColorValues(name, scheme) {
		var table = $('#colorValues');
		table.empty();
		$('<tr/>').append(
			$('<th>').text(name),
			$('<th>').text($.t('colorsystems.rgbhex')),
			$('<th>').text($.t('colorsystems.rgbdec')),
			$('<th>').text($.t('colorsystems.rgbfrac')),
			$('<th>').text($.t('colorsystems.hsl')),
			$('<th>').text($.t('colorsystems.hsv')),
			$('<th>').text($.t('colorsystems.cmyk')))
		.appendTo(table);
		for (var i = 0; i < scheme.length; ++i) {
			var clr = scheme[i];
			var color = new Color(scheme[i]);
			$('<tr/>').append(
				$('<td>').text(i + 1),
				$('<td>').text('#' + clr),
				$('<td>').text(new RGB255(color)),
				$('<td>').text(color),
				$('<td>').text(new HSL(color)),
				$('<td>').text(new HSV(color)),
				$('<td>').text(new CMYK(color))
			)
			.appendTo(table);
		}
	}
	
	function getColorTableURI(colors) {
		var size = 256;
		var a = new Uint8Array(3 * size);
		var n = Math.min(size, colors.length);

		for (var i = 0; i < n; ++i) {
			var v = colors[i];
			var r = parseInt(v.substr(0, 2), 16);
			var g = parseInt(v.substr(2, 2), 16);
			var b = parseInt(v.substr(4, 2), 16);
			a[i * 3] = r;
			a[i * 3 + 1] = g;
			a[i * 3 + 2] = b;
		}

		var b64 = btoa(String.fromCharCode.apply(null, a));
		return 'data:' + 'FILETYPE' + ';base64,' + b64;
	}
	
	init();
});
