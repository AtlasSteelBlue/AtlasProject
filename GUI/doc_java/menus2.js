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
   
    
    
 
   

    var menu1 = Ext.create('Ext.menu.Menu', {
        id: 'mainMenu1',
        style: {
            overflow: 'visible'     // For the Combo popup
        },
        items: [ 
            
                         // A Field in a Menu
     
        ]
    });
	
	
	   var menu2 = Ext.create('Ext.menu.Menu', {
        id: 'mainMenu',
        style: {
                // For the Combo popup
        },
        items: [
                         // A Field in a Menu
     
        ]
    });
	
	
	   var menu3 = Ext.create('Ext.menu.Menu', {
        id: 'mainMenu',
        style: {
                // For the Combo popup
        },
        items: [
                         // A Field in a Menu
     
        ]
    });
    //BLUE BOX
    var container =Ext.get('container');
	//Ext.get('container').setHeight( 35);
	
	
	 //
	 //.setWidth( 1200);
	//Ext.get('container').setHeight( 800);

    //var tb = Ext.create('Ext.toolbar.Toolbar',{backgroundColor:#c3daf9;
	//});
	/* var tb2=Ext.create('Ext.panel.Panel', {
     title: 'Toolbar Fill Example',
     width: 300,
     height: 200,
	 
	 backgroundColor:"#F00" ,
     tbar : [
         'Item 1',
         { xtype: 'tbfill' },
         'Item 2'
     ], */
/*      renderTo: Ext.getBody()
 }); */
	   var tb = Ext.create('Ext.toolbar.Toolbar',{
	
	   });
	   
    tb.render('toolbar');
    tb.suspendLayouts();
	

    tb.add({
            text:'&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp ALL TIME OLYMPIC GAMES  &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp        ',
            iconCls: 'bmenu',  // <-- icon
            menu1: menu1  // assign menu by instance
        },{
            text:'&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp SOCHI 2014 &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp',
            iconCls: 'bmenu',  // <-- icon
            menu2: menu2  // assign menu by instance
        }, {
            text:'&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp OLYMPIC OF SWITZERLAND &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp',
            iconCls: 'bmenu',  // <-- icon
            menu3: menu3  // assign menu by instance
        })
		



 

   
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
	

/* Ext.layout.VBoxLayout(panel2,
{
align
})
     */
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
	

/* Ext.layout.VBoxLayout(panel2,
{
align
})
     */
    Ext.each(configs, function(config) {
        var element = Ext.getBody().createChild({cls: 'panel3-container'});
        
        Ext.widget('panel', Ext.applyIf(config, {
            renderTo: element,
            bodyPadding: 7
        }));
    });
/* 	var panel2 = Ext.create('Ext.Panel', {
    width: 500,
    height: 400,
    title: "VBoxLayout Panel",
	collapseDirection: Ext.Component.DIRECTION_RIGHT,
	 collapsible:true,
	 html:html,
       align: 'right',
    layout: {
        type: 'vbox',
        align: 'right'
    },
    renderTo: document.body,
    items: []
}); */

/* Ext.layout.VBoxLayout */






//IMPRESSUM



	 var configs = [{
        title: 'IMPRESSUM',
        animCollapse: true,
        collapsible: true,
        width: 180,
		collapseDirection: Ext.Component.DIRECTION_DOWN,
        html: html2
    }];
	

/* Ext.layout.VBoxLayout(panel2,
{
align
})
     */
    Ext.each(configs, function(config) {
        var element = Ext.getBody().createChild({cls: 'panel4-container'});
        
        Ext.widget('panel', Ext.applyIf(config, {
            renderTo: element,
            bodyPadding: 7
        }));
    });

	
});






