Ext.define("Extend.window.IframeWindow", {
            extend : "Extend.window.ExtendWindow",
            alias : 'widget.IframeWindow',
            layout : 'border',
            loadMask : '加载...',
            modal : true,
            width : 1000,
            height : 500,
            bodyStyle : {
                background : '#FFF',
                padding : '10px'
            },
            initComponent : function()
            {
                var me = this;
                me.items = [{
                            xtype : 'uxiframe',
                            loadMask : me.loadMask,
                            listeners : {
                                load : function()
                                {
                                    var win = this.up('IframeWindow');
                                }
                            }
                        }];
                this.callParent(arguments);
            },
            load : function(src)
            {
                var $this = this;
                Ext.defer(function()
                        {
                            $this.down('uxiframe').load(src)
                        }, 100);
            }
        })