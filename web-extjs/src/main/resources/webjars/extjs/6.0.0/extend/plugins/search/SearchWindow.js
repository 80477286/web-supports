/**
 * <pre>
 * 增加事件：searching，开始搜索事件. 
 * 参数：params
 * </pre>
 */
Ext.define('Extend.plugins.search.SearchWindow', {
            extend : 'Ext.window.Window',
            constrain : true,
            draggable : true,
            resizable : true,
            modal : true,
            closeAction : 'hide',
            layout : 'border',
            width : 500,
            height : 300,
            iconCls : 'search',
            constructor : function(config)
            {
                var me = this;
                me.callParent(arguments);
            },
            initComponent : function()
            {
                var me = this;

                me.buttons = [{
                            text : me.searchText,
                            iconCls : 'search',
                            handler : function()
                            {
                                if (me.conditionEditorPanel.isValid())
                                {
                                    var params = me.conditionEditorPanel
                                            .getParams();
                                    me.fireEvent("searching", params);
                                    me.hide();
                                }
                            }
                        }, {
                            text : me.cancelText,
                            iconCls : 'cancel',
                            handler : function()
                            {
                                me.hide();
                            }
                        }];

                me.callParent();
                // 使用构造window时传入的field初始化查询表格的下拉框store
                me.conditionEditorPanel = Ext.create(
                        "Extend.plugins.search.ConditionEditorPanel", {
                            fields : me.fields
                        });
                me.add(me.conditionEditorPanel);
            },
            reset : function()
            {
                var me = this;
                me.conditionEditorPanel.getStore().removeAll();
            }
        });