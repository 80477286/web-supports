Ext.define('App.main.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'border',
    alias: 'widget.Viewport',
    requires: ['App.main.view.Center', 'App.main.view.North'],
    items: [{
        xtype: 'North',
        height: 65,
        minHeight: 65,
        listeners: {
            menuclick: function (clazz, options) {
                var center = this.up('viewport').down('Center');
                center.createComponent(clazz, options, true);
            }
        }
    }, {
        xtype: 'Center'
    }]
})