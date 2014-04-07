/*
	SWAParser.js
	
	Parses the SWA module files, collects the relevant information and and creates an OpenLayers map.
	
	Dependencies:
	- OpenLayers.js: the OpenLayers library
	- SWA.js: a sub-class of OpenLayers.Layer.XYZ
	- URI.js: resolves relative path names
	- sprintf-0.6.js: formats numbers
	
	© 2012: Swiss World Atlas, Hans Rudolf Bär, Insitute of Cartography and Geoinformation, ETH Zurich
*/

function SWAParser() {
	
	var baseURL = "http://karatlas.ethz.ch/swa";
	var indexURL = "/atlasindex_version_1/swa.xml";
	var loadingCounter;
	var mapInfo;
	var olMap;
	
	this.loadAtlas = function() {
		loadXML(baseURL + indexURL, loadIndex);
	}
	
	this.loadMap = function(module, map) {
		olMap = map;
		loadingCounter = 0;
		mapInfo = {};
		loadXML(baseURL + module, loadModule);
	}
	
	function loadIndex(xml) {
		var js = xmlToJS(xml);
		var baseURI = new URI(xml.baseURI);
		console.log(js);
		var file = nodeValue(js.atlas.access.variant[3].file[0]);
		console.log(file);
		var url = (new URI(file)).resolve(baseURI);
		console.log(url.toString());
		
		loadXML(url.toString(), loadContent);
	}

	function loadContent(xml) {
		var js = xmlToJS(xml);
		console.log(js);
		
		var ul = document.getElementById('list');
		
		forEach(js.atlas.menu.item, function(item) {
			// console.log(item);
			if (item.map) {
				var map = nodeValue(item.map);
				var name = nodeValue(item.name[0]);
				// console.log(name, ':', map);
				
				var li = document.createElement('li');
				var a = document.createElement('a');
				var text = document.createTextNode(name);
				
				a.appendChild(text);
				a.setAttribute('href', 'javascript:load("' + map + '");');
				li.appendChild(a);
				ul.appendChild(li);
			}
		});
		
	}
	
	/*
	 * Loads an XML file.
	 * 
	 * Parameteras
	 * - url: the URL of the XML file
	 * - callback: the function to call after loading
	 * - params: an optional parameter passed to the callback function
	 */
	function loadXML(url, callback, params) {
		var xhr = new XMLHttpRequest();
		// xhr.overrideMimeType('text/html;charset=utf-8');
		xhr.open("GET", url, true);
		xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
		xhr.onreadystatechange = function() {
            // console.log('ready state', xhr.readyState);
		}
		xhr.onload = function(evt) {
			callback(evt.srcElement.responseXML, params);
		}
		xhr.send();
	}
	
	/*
	 * Loads a module file.
	 *
	¨* The module file provides relevant information about the maps.
	 * Extracts layer information and loads the corresponding map files.
	 *
	 * Parameters:
	 * - xml: the contents of an XML file as a DOM tree
	 */
	function loadModule(xml) {
		var js = xmlToJS(xml);
		var baseURI = new URI(xml.baseURI);

		mapInfo.name = {};
		forEach(js.modules.name, function(name) {
			mapInfo.name[attr(name, 'xml:lang')] = nodeValue(name);
		});
		
		mapInfo.zooms = [];
		mapInfo.zoomLevels = {};
		mapInfo.namedLayers = {};
		mapInfo.layers = [];
		var modules = js.modules.modul;
		forEach(modules, function(mod) {
			if (attr(mod, 'type') == 'map') {
				loadingCounter = mod.zoomlevel.length;
				for (var j in mod.zoomlevel) {
					var zoomLevel = mod.zoomlevel[j];
					var zl = nodeValueAsInt(zoomLevel.level);
					mapInfo.zoomLevels[zl] = {};
					mapInfo.zooms.push(zl);
					var mapURL = (new URI(nodeValue(zoomLevel.url))).resolve(baseURI);
					loadXML(mapURL.toString(), loadZoomLevel, zl);
				}
			}
		});
	}
	
	/*
	 * Parses an XML tree for each zoom level.
	 *
	 * Parameter:
	 * - xml the XML tree
	 * - zoom: the zoom level
	 */
	function loadZoomLevel(xml, zoom) {
		--loadingCounter;
		console.log(loadingCounter);
		var mapObj = xmlToJS(xml).map;
		var baseURI = new URI(xml.baseURI);
		// console.log(mapObj);
		
		var tileWidth = nodeValueAsInt(mapObj.tilewidth);
		var tileHeight = nodeValueAsInt(mapObj.tileheight);
		
		var mapWidth = nodeValueAsInt(mapObj['map-width']);
		var mapHeight = nodeValueAsInt(mapObj['map-height']);
		
		var geoRef = mapObj['geo-ref'];
		var south = nodeValueAsFloat(geoRef['south']);
		var west = nodeValueAsFloat(geoRef['west']);
		var north = nodeValueAsFloat(geoRef['north']);
		var east = nodeValueAsFloat(geoRef['east']);
		
		mapInfo.zoomLevels[zoom].res = (east - west) / mapWidth;

		for (var i in mapObj.layer) {
			var layer = mapObj.layer[i];
			if (layer['image-tiles']) {
				// console.log(layer);
				var imageTiles = layer['image-tiles'];
				var path = nodeValue(imageTiles.path);
				var index = nodeValue(imageTiles.index);
				var nx = index.match(/x/g);
				var ny = index.match(/y/g);
				var fx = '%0' + nx.length + 'd';
				var fy = '%0' + ny.length + 'd';
				index = index.replace(/x+/, fx).replace(/y+/, fy);
				var suffix = nodeValue(imageTiles.suffix);
				var imageURL = (new URI(path + index + '.' + suffix)).resolve(baseURI);
				var id = attr(layer, 'id');
				if (! mapInfo.namedLayers[id]) {
					mapInfo.namedLayers[id] = {};
					mapInfo.layers.splice(i, 0, id);
				}
				if (! mapInfo.namedLayers[id].url) {
					mapInfo.namedLayers[id].url = {};
				}
				mapInfo.namedLayers[id].url[zoom] = imageURL.toString();
				mapInfo.namedLayers[id].vis = attr(layer, 'visible') != 'false';
			}
		}
		
		if (loadingCounter == 0) {
			mapInfo.ext = [west, south, east, north];
			mapInfo.tileSize = [tileWidth, tileHeight];
			console.log(mapInfo);
			installMap();
		}
	}
	
	/*
	 * Creates the OpenLayers map from the previously collected information
	 */
	function installMap() {
		var ext = mapInfo.ext;
		olMap.maxExtent = new OpenLayers.Bounds(ext[0], ext[1], ext[2], ext[3]);
		
		mapInfo.zooms.sort();
		var res = [];
		for (var i in mapInfo.zooms) {
			res.push(mapInfo.zoomLevels[mapInfo.zooms[i]].res);
		}
		olMap.resolutions = res; console.log(res);
		olMap.numZoomLevels = mapInfo.zooms.length;
		
		for (var i in mapInfo.layers) {
			var id = mapInfo.layers[i];
			var layer = mapInfo.namedLayers[id];
			var url = layer.url[1];
			if (url) {
				var options = {
					visibility: layer.vis,
					tileSize: new OpenLayers.Size(mapInfo.tileSize[0], mapInfo.tileSize[1])
				};
				var olLayer = new OpenLayers.Layer.SWA(id, layer.url, options);
				olMap.addLayer(olLayer);
			}
		}
		
		olMap.zoomToMaxExtent();
	}
	
	/*
	 * Transforms the XML DOM tree structure into a Javascript object.
	 *
	 * Parameters:
	 * - xml: the XML DOM tree
	 * Returns:
	 * Javascript object of the DOM tree
	 */
	function xmlToJS(xml) {
		var obj = {};
		
		switch(xml.nodeType) {
			
			case Node.ELEMENT_NODE:
			if (xml.attributes.length) {
				var attrs = {};
				for (var i = 0; i < xml.attributes.length; ++i) {
					var attribute = xml.attributes.item(i);
					attrs[attribute.nodeName] = attribute.nodeValue;
				}
				obj["@attr"] = attrs;
			}
			case Node.DOCUMENT_NODE:
			if (xml.hasChildNodes()) {
				for (var i = 0; i < xml.childNodes.length; i++) {
					var item = xml.childNodes.item(i);
					var child = xmlToJS(item);
					if (child) {
						var nodeName = item.nodeName;
						if (obj[nodeName]) {
							if (obj[nodeName].length) {
								obj[nodeName].push(child);
							}
							else {
								obj[nodeName] = [obj[nodeName], child];
							}
						}
						else {
							obj[nodeName] = child;
						}
					}
				}
			}
			break;
			
			case Node.TEXT_NODE:
			var text = xml.nodeValue.trim();
			obj = text.length ? text : null;
			break;
		}
		return obj;
	}
	
	/*
	 * A convenient method that calls a given function for each element.
	 *
	 * Parameters:
	 * - items: a single value or an array
	 * - fun: the function to call
	 */
	function forEach(items, fun) {
		if (items.length) {
			for (var i in items) {
				fun(items[i]);
			}
		}
		else {
			fun(items);
		}
	}
	
	function nodeValue(node) {
		return node['#text'];
	}
	
	function nodeValueAsInt(node) {
		return parseInt(nodeValue(node));
	}
	
	function nodeValueAsFloat(node) {
		return parseFloat(nodeValue(node));
	}
	
	function attr(node, name) {
		return node['@attr'][name];
	}
}
