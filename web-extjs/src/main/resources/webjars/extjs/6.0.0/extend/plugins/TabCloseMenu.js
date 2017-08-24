Ext.define("Extend.plugins.TabCloseMenu", {
            extend : 'Ext.ux.TabCloseMenu',
            alias : 'ptype.mtabclosemenu',
            closeLeftTabsText : 'Close Left Tabs',
            closeRightTabsText : 'Close Right Tabs',
            showCloseLeft : true,
            showCloseRight : true,
            onHideMenu : function()
            {
                var me = this;
                me.fireEvent('aftermenu', me.menu, me);
            },
            // public
            constructor : function(config)
            {
                this.callParent(arguments);
                var me = this;
                if (config.extraItemsTail)
                {
                    me.extraItemsTail = config.extraItemsTail;
                } else
                {
                    me.extraItemsTail = [];
                    if (me.showCloseOthers || me.showCloseLeft
                            || me.showCloseRight)
                    {
                        me.extraItemsTail.push('-');
                    }

                    if (me.showCloseLeft)
                    {
                        me.extraItemsTail.push({
                                    text : me.closeLeftTabsText,
                                    scope : me,
                                    handler : me.onCloseLeft
                                });
                    }

                    if (me.showCloseRight)
                    {
                        me.extraItemsTail.push({
                                    text : me.closeRightTabsText,
                                    scope : me,
                                    handler : me.onCloseRight
                                });
                    }
                }
            },
            onCloseLeft : function()
            {
                var items = [];

                for (var i = 0; i < this.tabPanel.items.getCount(); i++)
                {
                    var item = this.tabPanel.items.getAt(i);
                    if (item != this.item)
                    {
                        if (item.closable)
                        {
                            items.push(item);
                        }
                    } else
                    {
                        break;
                    }
                }

                Ext.each(items, function(item)
                        {
                            this.tabPanel.remove(item);
                        }, this);
            },
            onCloseRight : function()
            {
                var items = [];

                var sted = false;
                for (var i = 0; i < this.tabPanel.items.getCount(); i++)
                {
                    var item = this.tabPanel.items.getAt(i);
                    if (item == this.item && !sted)
                    {
                        sted = true;
                    } else if (sted)
                    {
                        if (item.closable)
                        {
                            items.push(item);
                        }
                    }
                }

                Ext.each(items, function(item)
                        {
                            this.tabPanel.remove(item);
                        }, this);
            }
        });