/*
 * Student Project in Multimedia Cartography
 * ©2014 Insitute of Cartography and Geoinformation
 */

$(document).ready(function() {

	var map, geom, select;
	var utils = window['CARTOUTILS'];
	var categories = new OpenLayers.Control.Categories({ suffix: '%' });
	
	/*
	 * This function expects mapping parameters passed as an URL query string.
	 */
	function useURLQueryString() {
	// In order to test a map use a query string similar to the one below:
/* 
?data=%22.%2Fbfs%2Fpx-d-40-3B01.px%22&extract=%5B%5B0%2C%22*%22%2C2%2C0%2C0%5D%2C%5B0%2C%22*%22%2C0%2C0%2C0%5D%5D&calculate=%5B%22v%22%2C%22return%20100%20*%20parseInt(v%5B0%5D)%20%2F%20parseInt(v%5B1%5D)%3B%22%5D&layerNum=1&breakValues=%5B5%2C10%2C15%2C20%2C25%2C30%5D&colorBrewer=%5B%22sequential%22%2C%22RdPu%22%2C7%5D
*/
		var statistics = utils.convertQueryStringToObject(window.document.URL);
		if (statistics.data) {
			showStatistics(statistics);
		}
	}
	
	/*
	 * This function allows to test a statistical map outside the atlas framework.
	 */
	function performMapTest() {
		
		showStatistics({
			data: './bfs/px-d-40-3B01.px',
			extract: [[0, '*', 2, 0, 0], [0, '*', 0, 0, 0]],
			calculate: ['v', 'return 100 * parseInt(v[0]) / parseInt(v[1]);'],
			layerNum: 1,
			breakValues: [5, 10, 15, 20, 25, 30],
			colorBrewer: ['sequential', 'Blues', 7]
		});
	}
	
	var extent = new OpenLayers.Bounds(480000, 62000, 865000, 302000);
	
	var ul = $('#list');
	
	// Handle mouse-over in list.
	ul.on('mouseover.list', function(evt) {
		var feature = geom.getFeatureById(evt.target.id);
		select.highlight(feature);
	});

	// Handle mouse-out in list.
	ul.on('mouseout.list', function(evt) {
		var feature = geom.getFeatureById(evt.target.id);
		select.unhighlight(feature);
	});

	// Handle mouse click in list.
	ul.on('click.list', function(evt) {
		var feature = geom.getFeatureById(evt.target.id);
		var center = feature.geometry.getCentroid();
		map.setCenter(new OpenLayers.LonLat(center.x, center.y));
		select.highlight(feature);
	});
	
	// Show statistics on message event.
	$(window).on('message', function(evt) {
		var options = evt.originalEvent.data.params;
		showStatistics(options);
	});
	
	var options = {
		maxExtent: extent,
		restrictedExtent: extent,
		units: 'm',
		fractionalZoom: true,
		maxScale: 400000,
		minScale: 1500000,
		numZoomLevels: 12,
		controls: []
	};
	
	// Auxiliary function to remove white space around a text.
	function strip(text) {
		return text.replace(/^\s+|\s+$/g, '');
	}
	
	function formatNumber(value) {
		return ("" + value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	// Extract statistical data from the database file.
	function extract(px, columnDefs, calculate) {
		var table = {};
		var columnData = [];
		for (var i = 0; i < columnDefs.length; ++i) {
			columnData.push(px.dataCol(columnDefs[i]));
		}
		var index = columnDefs[0].indexOf('*');
		var codes = px.codes(index);
		var n = columnData[0].length;
		for (var i = 0; i < n; ++i) {
			var code = codes[i];
			if (code.match(/\.{6}/)) {
				var data = [];
				for (var j = 0; j < columnData.length; ++j) {
					data.push(columnData[j][i]);
				}
				var v = calculate(data);
				if (i < 10) {
					console.log(v, data);
				}
				var id = parseInt(code.substr(6, 4), 10);
				var name = code.substr(11);
				table[id] = [name, v];
			}
		}
		
		return table;	
	}
	
	// Write some statistical data to the console.
	function show(px) {
		// console.log(px);
		console.log('Title:', px.title());
		var count = px.valCounts();
		console.log('Value count:', count);
		var vars = px.variables();
		for (var i in vars) {
			var v = vars[i];
			console.log(v);
			var vals = px.values(parseInt(i));
			for (var j in vals) {
				console.log('\t', vals[j]);
				if (j == 10) {
					console.log('\t...');
					break;
				}
			}
		}
	}
	
	// Show the statistical data on a map
	function showStatistics(options) {
		var layer = map.layers[options.layerNum];
		var xhr = new XMLHttpRequest();
		xhr.overrideMimeType("text/plain; charset=ISO-8859-1");
		xhr.open("GET", options.data, true);
		xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
		xhr.onload = function(evt) {
			if (typeof options.calculate == 'object') {
				options.calculate = Function.apply(null, options.calculate);
			}
			// Create the color table
			var colors = brewercolors[options.colorBrewer[0]][options.colorBrewer[1]][options.colorBrewer[2] - 3];
			var styles = [];
			for (var i = 0; i < colors.length; ++i) {
				styles[i] = { fillColor: '#' + colors[i], strokeColor: '#484', strokeWidth: 0.35, fillOpacity: 0.7 };
			}
			// Create the statistics table
			var px = new Px(xhr.responseText);
			show(px);
			var table = extract(px, options.extract, options.calculate);
			// Apply the styles
			var features = layer.features;
			for (var i = 0; i < features.length; ++i) {
				var feature = features[i];
				var rec = table[feature.xid];
				if (rec) {
					var value = rec[1];
					// The following function returns a graphic style for every data value
					feature.style = utils.classValue(options.breakValues, styles, value);
				}
			}
			layer.setVisibility(true);
			layer.redraw();
			
			categories.setCategories(colors, options.breakValues);
		}
		xhr.send();
	}
	
	// A convenient function that adds vector layers to the map.
	function addVectorLayer(map, name, url, opts) {
		var layer = new OpenLayers.Layer.Vector(name, opts);
		getOpenLayersFeatures(url, function(vectors) {
		layer.addFeatures(vectors);
			if (opts.hilite) {
				geom = layer;
				// if (statistics) showStatistics(statistics);
				for (var i = 0; i < vectors.length; ++i) {
					var vector = vectors[i];
					var nn = strip(vector.data.values.NAME);
					vector.xid = parseInt(vector.data.values.GMDE);
					$('<li/>').attr('id', vector.id).text(nn).appendTo(ul);
				}
				// Sort the list
				var li = ul.children('li').get();
				li.sort(function(a, b) {
					return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
				})
				$.each(li, function(idx, itm) { ul.append(itm); });
				// Enable selection
				var control = new OpenLayers.Control.SelectFeature(layer, opts.hilite);
				select = control;
				map.addControl(control);
				control.activate();
			}
		});
		map.addLayer(layer);
	}
	
	// Mouse interactions.
    var onReport = function(e) {
		$('#info').text(strip(e.feature.data.values.NAME));
    };

    var offReport = function(e) {
		$('#info').text('');
	};

	var hilite = {
		hover: true,
		highlightOnly: true,
		renderIntent: "temporary",
		selectStyle: { fillColor: '#fff', strokeColor: '#f00', strokeWidth: 5.0, fillOpacity: 0.35, strokeOpacity: 0.35 },
		eventListeners: {
			featurehighlighted: onReport,
			featureunhighlighted : offReport
		}
	};
    
	map = new OpenLayers.Map('map', options);
	map.addControl(new OpenLayers.Control.Navigation({ documentDrag: true }));
	map.addControl(new OpenLayers.Control.PanZoomBar({ slideRatio: 0.1, fractionalZoom: true }));
	map.addControl(new OpenLayers.Control.MousePosition({
		numDigits: 0,
		formatOutput: function(lonLat) {
			console.log(lonLat);
			return formatNumber(2000000 + Math.round(lonLat.lon)) + ' / ' + formatNumber(1000000 + Math.round(lonLat.lat));
		}
	}));
	map.addControl(new OpenLayers.Control.ScaleLine());
	map.addControl(new OpenLayers.Control.LayerSwitcher());
	map.addControl(categories);
	
	map.addLayer(new OpenLayers.Layer.Image(
		'Relief',
		'./mapimages/relief_1mio.jpg',
		extent,
		{ style: { opacity: 1.0 } }
	));

	addVectorLayer(map, "Gemeinden", 'bfs/gd-b-00/g3g01-shp_080214/G3G01', {
		style: { fillColor: '#ec8', strokeColor: '#484', strokeWidth: 0.35, fillOpacity: 0.25 },
		displayInLayerSwitcher: false, hilite: hilite, visibility: false });
	addVectorLayer(map, "Bezirke", 'bfs/gd-b-00/g3g01-shp_080214/G3B01', {
		style: { fillColor: 'none', strokeColor: '#484', strokeWidth: 0.6 } });
	addVectorLayer(map, "Kantone", 'bfs/gd-b-00/g3g01-shp_080214/G3K01', {
		style: { fillColor: 'none', strokeColor: '#484', strokeWidth: 1.3 } });
	addVectorLayer(map, "Seen", 'bfs/gd-b-00/g3g01-shp_080214/G3S01', {
		style: { fillColor: '#8cf', strokeColor: '#35f', strokeWidth: 0.5, fillOpacity: 1.0 } });
	addVectorLayer(map, "Landesgrenzen", 'bfs/gd-b-00/g3g01-shp_080214/G3L01', {
		style: { fillColor: 'none', strokeColor: '#484', strokeWidth: 6.0, strokeOpacity: 0.35 } });
		
	map.zoomToMaxExtent();
	
	// Call the function below if you want to test the statistical map outside the atlas framework.
	// useURLQueryString();
	
	// Call the function below if you want to test the statistical map outside the atlas framework.
	performMapTest();
	
});
