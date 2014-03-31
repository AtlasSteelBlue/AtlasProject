Ext.require([
    'Ext.tip.QuickTipManager',
    'Ext.menu.*',
    'Ext.form.field.ComboBox',
    'Ext.layout.container.Table',
    'Ext.container.ButtonGroup'
]);
Ext.require('Ext.slider.*');
Ext.require([
    '*'
]);

Ext.onReady(function(){
    
    // functions to display feedback
   
    function onButtonClick(btn){
        Ext.example.msg('Button Click','You clicked the "{0}" button.', btn.displayText || btn.text);
    }
    
  function onItemClick(item){
        Ext.example.msg('Menu Click', 'You clicked the "{0}" menu item.', item.text);
    }
	
    function onItemCheck(item, checked){
        Ext.example.msg('Item Check', 'You {1} the "{0}" menu item.', item.text, checked ? 'checked' : 'unchecked');
    }

    function onItemToggle(item, pressed){
        Ext.example.msg('Button Toggled', 'Button "{0}" was toggled to {1}.', item.text, pressed);
    }
    
	
	
   
   

    var menu1 = Ext.create('Ext.menu.Menu', {
        id: 'mainMenu1',
        style: {
            overflow: 'visible'     // For the Combo popup
        },
        items: [ 
               {
                    text: '&nbsp&nbsp&nbsp&nbsp Summer Medals &nbsp&nbsp&nbsp&nbsp',
                    handler: onItemClick
                },
				{
                    text: '&nbsp&nbsp&nbsp&nbsp Winter Medals &nbsp&nbsp&nbsp&nbsp',
                    handler: onItemClick
                },
				{
                    text: '&nbsp&nbsp&nbsp&nbsp Costs &nbsp&nbsp&nbsp&nbsp',
                    handler: onItemClick
                }
                
            
            
                         // A Field in a Menu
     
        ]
    });
	
	
	    var menu2 = Ext.create('Ext.menu.Menu', {
        id: 'mainMenu2',
        style: {
            overflow: 'visible'     // For the Combo popup
        },
        items: [ 
               {
                    text: '&nbsp&nbsp&nbsp&nbsp Rosa  &nbsp&nbsp&nbsp&nbsp',
                    /* handler: onItemClick */
                },
				{
                    text: '&nbsp&nbsp&nbsp&nbsp Sochi &nbsp&nbsp&nbsp&nbsp',
                  /*   handler: onItemClick */
                }
                
            
                         // A Field in a Menu
     
        ]
    });
	
	
   
	
	
	   var menu3 = Ext.create('Ext.menu.Menu', {
        id: 'mainMenu3',
        style: {
                // For the Combo popup
        },
        items: [
		{
                    text: '&nbsp&nbsp&nbsp&nbsp Summer Medals &nbsp&nbsp&nbsp&nbsp',
                    handler: onItemClick
                },
				{
                    text: '&nbsp&nbsp&nbsp&nbsp Winter Medals &nbsp&nbsp&nbsp&nbsp',
                    handler: onItemClick
                },
				{
                    text: '&nbsp&nbsp&nbsp&nbsp Costs &nbsp&nbsp&nbsp&nbsp',
                    handler: onItemClick
                }
                
            
            
		]
		
    });
	
	var menu4 = Ext.create('Ext.menu.Menu', {
        id: 'mainMenu4',
        style: {
                // For the Combo popup
        },
        items: [
                         // A Field in a Menu
     
        ]
    });
    //BLUE BOX
    var container =Ext.get('container');
	
	var container5 =Ext.get('container');
	

	   var tb = Ext.create('Ext.toolbar.Toolbar',{
	
	   });
	   
    tb.render('toolbar');
    tb.suspendLayouts();
	

    tb.add({
            text:'&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp ALL TIME OLYMPIC GAMES  &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp       ',
            iconCls: 'bmenu',  // <-- icon
            menu: menu1  // assign menu by instance
        },{
            text:'&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp SOCHI 2014 &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp',
            iconCls: 'bmenu',  // <-- icon
            menu: menu2  // assign menu by instance
        }, {
            text:'&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp OLYMPIC OF SWITZERLAND &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp',
            iconCls: 'bmenu',  // <-- icon
            menu: menu3  // assign menu by instance
        },{
            text:'&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp  GAME &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp  &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp',
            iconCls: 'bmenu',  // <-- icon
            menu: menu4  // assign menu by instance
        })
	
	
	
	 var store = Ext.create('Ext.data.ArrayStore', {
        fields: ['abbr', 'state'],
        data : Ext.example.states
    });

    var combo = Ext.create('Ext.form.field.ComboBox', {
        hideLabel: true,
        store: store,
        displayField: 'state',
        typeAhead: true,
        queryMode: 'local',
        triggerAction: 'all',
        emptyText: 'Search',
        selectOnFocus: true,
        width: 135,
        indent: true
    });
	
	
	
 combo = Ext.create('Ext.form.field.ComboBox', {
        hideLabel: true,
        store: store,
        displayField: 'state',
        typeAhead: true,
        queryMode: 'local',
        triggerAction: 'all',
        emptyText:'             Search                                                                           ',
        selectOnFocus:true,
        width:135
    });
    tb.add(combo);
  tb.resumeLayouts(true);
	
	
	Ext.create('Ext.slider.Single', {
        renderTo: 'basic-slider',
        hideLabel: true,
        width:500,
        minValue: 1886,
        maxValue: 2014
    });
	
	
	
	//panel
	
	var html = '<p> Legend 1'+'Legend 2</p>';
	var html2 = '<p> IMPRINT</p>';
    
    var configs = [{
        title: 'Legend',
        collapsible:true,
        width:180,
		collapseDirection: Ext.Component.DIRECTION_RIGHT,
        html: html
	
    }];
	


    Ext.each(configs, function(config) {
        var element = Ext.getBody().createChild({cls: 'panel2-container'});
        
        Ext.widget('panel', Ext.applyIf(config, {
            renderTo: element,
            bodyPadding: 7
        }));
    });
    
	
	
	
	
	
	 var configs = [{
        title: 'Copyright',
        collapsible:true,
        width:180,
		collapseDirection: Ext.Component.DIRECTION_RIGHT,
        html: html
	
    }];
	


    Ext.each(configs, function(config) {
        var element = Ext.getBody().createChild({cls: 'panel3-container'});
        
        Ext.widget('panel', Ext.applyIf(config, {
            renderTo: element,
            bodyPadding: 7
        }));
    });

//IMPRESSUM

	 var configs = [{
        title: 'IMPRESSUM',
        animCollapse: false,
        collapsible: false,
        width: 180,
	
    }];
	

	
});






