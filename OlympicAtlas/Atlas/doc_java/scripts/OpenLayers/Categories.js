/*
	Atlas Project in Multimedia Cartography
	Institute of Cartography and Geoinformation
	ETH Zurich
	Author: Hansruedi Bär hbaer@hethz.ch
	
	Categories: OpenLayers Control extension
	Versions
	2013-2-22: Created
*/

OpenLayers.Control.Categories = OpenLayers.Class(OpenLayers.Control, {
	categoriesDiv: null,
	minimizeDiv: null,
	maximizeDiv: null,
	colorsValues: null,
	breakValues: null,
	maximized: false,
	invalid: true,
	suffix: '',

	/*
	 * Initializes the categories control.
	 */
	initialize: function(options) {
		OpenLayers.Control.prototype.initialize.apply(this, arguments);
	},

	/*
	 * Destructs the categories control.
	 */
	destroy: function() {
		this.map.events.un({
			buttonclick: this.onButtonClick,
			addlayer: this.redraw,
			changelayer: this.redraw,
			removelayer: this.redraw,
			scope: this
		});
		this.events.unregister("buttonclick", this, this.onButtonClick);
		OpenLayers.Control.prototype.destroy.apply(this, arguments);
	},

	/*
	 * Sets the map this control belongs to.
	 */
	setMap: function(map) {
		OpenLayers.Control.prototype.setMap.apply(this, arguments);
		this.map.events.on({
			addlayer: this.redraw,
			changelayer: this.redraw,
			removelayer: this.redraw,
			scope: this
		});
		if (this.outsideViewport) {
			this.events.attachToElement(this.div);
			this.events.register("buttonclick", this, this.onButtonClick);
		} else {
			this.map.events.register("buttonclick", this, this.onButtonClick);
		}
	},

	/*
	 * Called when ready to draw.
	 */
	draw: function() {
		OpenLayers.Control.prototype.draw.apply(this);
		this.loadContents();
		if(!this.outsideViewport) {
			this.minimizeControl();
		}
		this.redraw();    
		return this.div;
	},

	/*
	 * Handles minimize and maximize button clicks.
	 */
	onButtonClick: function(evt) {
		var button = evt.buttonElement;
		if (button === this.minimizeDiv) {
			this.minimizeControl();
		} else if (button === this.maximizeDiv) {
			this.maximizeControl();
		}
	},

	/*
	 * Called when redrawing is necessary.
	 */
	redraw: function() {
		if (this.maximized) {
			this.loadCategories();
		}
		else {
			this.unloadCategories();
		}
		return this.div;
	},

	/*
	 * Maximizes this control.
	 */
	maximizeControl: function(e) {
		this.maximized = true;
		this.div.style.width = "";
		this.div.style.height = "";
		this.showControls(false);
		if (this.invalid) {
			this.loadCategories();
		}
		if (e != null) {
			OpenLayers.Event.stop(e);                                            
		}
	},

	/*
	 * Minimizes this control.
	 */
	minimizeControl: function(e) {
		this.maximized = false;
		this.div.style.width = "0px";
		this.div.style.height = "0px";
		this.showControls(true);
		this.unloadCategories();
		if (e != null) {
			OpenLayers.Event.stop(e);                                            
		}
	},

	/*
	 * Shows or hides this control.
	 */
	showControls: function(minimize) {
		this.maximizeDiv.style.display = minimize ? "" : "none";
		this.minimizeDiv.style.display = minimize ? "none" : "";
		this.categoriesDiv.style.display = minimize ? "none" : "";
	},

	/*
	 * Loads the basic control elements.
	 */
	loadContents: function() {
		// categories panel div
		this.categoriesDiv = document.createElement("div");
		this.categoriesDiv.id = this.id + "_categoriesDiv";
		OpenLayers.Element.addClass(this.categoriesDiv, "categoriesDiv");
		this.div.appendChild(this.categoriesDiv);

		// maximize button div
		var img = OpenLayers.Util.getImageLocation('layer-switcher-maximize.png');
		this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_MaximizeDiv", null, null, img, "absolute");
		OpenLayers.Element.addClass(this.maximizeDiv, "maximizeDiv olButton");
		this.maximizeDiv.style.display = "none";

		this.div.appendChild(this.maximizeDiv);

		// minimize button div
		var img = OpenLayers.Util.getImageLocation('layer-switcher-minimize.png');
		this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv("OpenLayers_Control_MinimizeDiv", null, null, img, "absolute");
		OpenLayers.Element.addClass(this.minimizeDiv, "minimizeDiv olButton");
		this.minimizeDiv.style.display = "none";

		this.div.appendChild(this.minimizeDiv);
	},

	/*
	 * Sets the categories.
	 * Remark: It would be preferable to get this information from the layer,
	 * but currently the layer does not know about this.
	 * Parameters:
	 * colors: an array of n hex color strings without the '#' sign
	 * breakvalues: an array of n - 1 values in ascending order
	 */
	setCategories: function(colors, values) {
		this.colorValues = colors;
		this.breakValues = values;
		this.invalid = true;
		if (this.maximized) {
			this.loadCategories();
		}
	},

	/*
	 * Loads the categories.
	 */
	loadCategories: function() {
		if (! this.colorValues || !this.breakValues) {
			return;
		}
		// Remove any previous categories
		this.unloadCategories();
		// Add the main panel
		var categoriesPanel = document.createElement("div");
		OpenLayers.Element.addClass(categoriesPanel, "categoriesPanel");
		this.categoriesDiv.appendChild(categoriesPanel);
		// Add the color panel
		var colorPanel = document.createElement("div");
		OpenLayers.Element.addClass(colorPanel, "colorPanel");
		categoriesPanel.appendChild(colorPanel);
		// Add the color boxes
		for (var index in this.colorValues) {
			var color = this.colorValues[index];
			var colorBox = document.createElement("div");
			colorBox.style.backgroundColor = '#' + color;
			OpenLayers.Element.addClass(colorBox, "color");
			colorPanel.appendChild(colorBox);
		}
		// Add the number panel
		var numberPanel = document.createElement("div");
		OpenLayers.Element.addClass(numberPanel, "numberPanel");
		categoriesPanel.appendChild(numberPanel);
		// Add a space box, all number boxes and a final space box
		var spaceBox = document.createElement("div");
		OpenLayers.Element.addClass(spaceBox, "space");
		numberPanel.appendChild(spaceBox);
		for (var index in this.breakValues) {
			var breakValue = this.breakValues[index];
			var breakValueBox = document.createElement("div");
			breakValueBox.innerHTML = breakValue + this.suffix;
			OpenLayers.Element.addClass(breakValueBox, "number");
			numberPanel.appendChild(breakValueBox);
		}
		spaceBox = document.createElement("div");
		OpenLayers.Element.addClass(spaceBox, "space");
		numberPanel.appendChild(spaceBox);
		this.invalid = false;
	},
	
	/*
	 * Unloads the categories.
	 */
	unloadCategories: function() {
		// Remove any previous categories
		while (this.categoriesDiv.firstChild) {
			this.categoriesDiv.removeChild(this.categoriesDiv.firstChild);
		}
		this.invalid = true;
	},

	CLASS_NAME: "OpenLayers.Control.Categories"
});
