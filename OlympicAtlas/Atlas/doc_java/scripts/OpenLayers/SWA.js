/*
 * Implementation of an SWA tiles layer.
 *
 * Hans Rudolf Bär
 * Institute of Cartography and Geoinformation
 * CH-8093 ETH Zurich
 * baer@karto.baug.ethz.ch
 * 2012-09-28
 */

/**
 * @requires OpenLayers/Layer/XYZ.js
 */

/**
 * Class: OpenLayers.Layer.SWA
 * This layer allows accessing SWA tiles. By default the OpenStreetMap
 *    hosted tile.openstreetmap.org Mapnik tileset is used. If you wish to use
 *    a different layer instead, you need to provide a different
 *    URL to the constructor. Here's an example for using OpenCycleMap:
 * 
 * (code)
 *     new OpenLayers.Layer.OSM("OpenCycleMap", 
 *       ["http://a.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
 *        "http://b.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
 *        "http://c.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png"]); 
 * (end)
 *
 * Inherits from:
 *  - <OpenLayers.Layer.XYZ>
 */
OpenLayers.Layer.SWA = OpenLayers.Class(OpenLayers.Layer.XYZ, {

    /**
     * APIProperty: name
     * {String} The layer name. Defaults to "Swiss World Atlas" if the first
     * argument to the constructor is null or undefined.
     */
    name: "Swiss World Atlas",

    /**
     * APIProperty: url
     * {String} The tileset URL scheme. Defaults to
     * : http://[a|b|c].tile.openstreetmap.org/${z}/${x}/${y}.png
     * (the official OSM tileset) if the second argument to the constructor
     * is null or undefined. To use another tileset you can have something
     * like this:
     * (code)
     *     new OpenLayers.Layer.OSM("OpenCycleMap", 
     *       ["http://a.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
     *        "http://b.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
     *        "http://c.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png"]); 
     * (end)
     */
    url: [],

    /**
     * Property: attribution
     * {String} The layer attribution.
     */
    attribution: "Data ©2008–2012 by <a href='http://schweizerweltatlas.ch'>Swiss World Atlas</a>",

    /**
     * Property: sphericalMercator
     * {Boolean}
     */
    sphericalMercator: false,

    /**
     * Property: wrapDateLine
     * {Boolean}
     */
    wrapDateLine: false,

    /** APIProperty: tileOptions
     *  {Object} optional configuration options for <OpenLayers.Tile> instances
     *  created by this Layer. Default is
     *
     *  (code)
     *  {crossOriginKeyword: 'anonymous'}
     *  (end)
     *
     *  When using OSM tilesets other than the default ones, it may be
     *  necessary to set this to
     *
     *  (code)
     *  {crossOriginKeyword: null}
     *  (end)
     *
     *  if the server does not send Access-Control-Allow-Origin headers.
     */
    tileOptions: null,

    /**
     * Constructor: OpenLayers.Layer.SWA
     *
     * Parameters:
     * name - {String} The layer name.
     * url - {String} The tileset URL scheme.
     * options - {Object} Configuration options for the layer. Any inherited
     *     layer option can be set in this object (e.g.
     *     <OpenLayers.Layer.Grid.buffer>).
     */
    initialize: function(name, url, options) {
        OpenLayers.Layer.XYZ.prototype.initialize.apply(this, arguments);
        this.tileOptions = OpenLayers.Util.extend({
            crossOriginKeyword: 'anonymous'
        }, this.options && this.options.tileOptions);
    },

    /**
     * Method: getURL
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     *
     * Returns:
     * {String} A string with the layer's url and parameters and also the
     *          passed-in bounds and appropriate tile size specified as
     *          parameters
     */
    getURL: function (bounds) {
        var xyz = this.getXYZ(bounds);
        var url = this.url[xyz.z + 1];
        if (url) {
            url = sprintf(url, xyz.y, xyz.x);
        }
        return url;
    },

    /**
     * Method: clone
     */
    clone: function(obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.SWA(
                this.name, this.url, this.getOptions());
        }
        obj = OpenLayers.Layer.XYZ.prototype.clone.apply(this, [obj]);
        return obj;
    },

    CLASS_NAME: "OpenLayers.Layer.SWA"
});
