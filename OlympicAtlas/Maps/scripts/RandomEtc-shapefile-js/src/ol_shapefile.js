// Contributed by Matt Conway <indicatrix.wordpress.com>, <github.com/mattwigway>, Dec 2011.
// Based on a copy of layer.js
// Corrected some errors with multiple vectors: 2012-9-26 HB

/** getOpenLayersFeatures
 * @param {String} url - the base url for the shapefile, without extensions
 * @param {Function} callback Called with an array of OpenLayers.Feature.Vector for the given URL
 */
function getOpenLayersFeatures(url, callback) {
    var shpURL = url+'.shp';
    var dbfURL = url+'.dbf';
    var shpFile, dbfFile;

    // Parse into OL features
    var parseShapefile = function () {
	// we can assume that shapefile and dbf have loaded at this point, but check anyhow
	
	var features = [];

	var recsLen = shpFile.records.length;
	for (var i = 0; i < recsLen; i++) {
	    var record = shpFile.records[i];
	    var attrs = dbfFile.records[i];

	    // turn shapefile geometry into WKT
	    // points are easy!
	    if (shpFile.header.shapeType == ShpType.SHAPE_POINT) {
		var wkt = 'POINT(' + record.shape.x + ' ' + record.shape.y + ')';
	    }

	    // lines: not too hard--
	    else if (shpFile.header.shapeType == ShpType.SHAPE_POLYLINE) {
		// prepopulate the first point
		var points = [];//record.shape.rings[0].x + ' ' + record.shape.rings[0].y];
		var pointsLen = record.shape.rings[0].length;
		for (var j = 0; j < pointsLen; j++) {
		    points.push(record.shape.rings[0][j].x + ' ' + record.shape.rings[0][j].y);
		}
		
		var wkt = 'LINESTRING(' + points.join(', ') + ')';
	    }

	    // polygons: donuts
	    else if (shpFile.header.shapeType == ShpType.SHAPE_POLYGON) {
		var ringsLen = record.shape.rings.length;
		var wktOuter = [];
		for (var j = 0; j < ringsLen; j++) {
		    var ring = record.shape.rings[j];
		    if (ring.length < 1) continue;
		    var wktInner = [];//ring.x + ' ' + ring.y];
		    var ringLen = ring.length;
		    for (var k = 0; k < ringLen; k++) {
			wktInner.push(ring[k].x + ' ' + ring[k].y);
		    }
		    wktOuter.push('(' + wktInner.join(', ') + ')');
		}
		var wkt = 'POLYGON(' + wktOuter.join(', ') + ')';
	    }

	    var the_geom = OpenLayers.Geometry.fromWKT(wkt);
	    features.push(new OpenLayers.Feature.Vector(the_geom, attrs));
	}
	callback(features);
    };	
    
    var onShpFail = function() { 
	alert('failed to load ' + shpURL);
    };
    var onDbfFail = function() { 
	alert('failed to load ' + dbfURL);
    }

    var onShpComplete = function(oHTTP) {
	var binFile = oHTTP.binaryResponse;
	// console.log('got data for ' + shpURL + ', parsing shapefile');
	shpFile = new ShpFile(binFile);
	if (dbfFile) parseShapefile();
    }

    var onDbfComplete = function(oHTTP) {
	var binFile = oHTTP.binaryResponse;
	// console.log('got data for ' + dbfURL + ', parsing dbf file');
	dbfFile = new DbfFile(binFile);
	if (shpFile) parseShapefile();
    }  

    new BinaryAjax(shpURL, onShpComplete, onShpFail);
    new BinaryAjax(dbfURL, onDbfComplete, onDbfFail);
}
