Ext.define('Extend.layout.ExtendBorder', {
            extend : 'Ext.layout.container.Border',
            alias : ['widget.ExtendBorder'],
            insertSplitter : function(item, index, hidden, splitterCfg)
            {
                var region = item.region, splitter = Ext.apply({
                    xtype : 'bordersplitter',
                    collapseTarget : item,
                    id : item.id + '-splitter',
                    hidden : hidden,
                    canResize : item.splitterResize !== false,
                    splitterFor : item,
                    synthetic : true
                        // not user-defined
                    }, splitterCfg), at = index + ((region === 'south' || region === 'east') ? 0 : 1);

                if (item.collapseMode === 'mini')
                {
                    splitter.collapsedCls = item.collapsedCls;
                }

                item.splitter = this.owner.add(at, splitter);
            }
        })