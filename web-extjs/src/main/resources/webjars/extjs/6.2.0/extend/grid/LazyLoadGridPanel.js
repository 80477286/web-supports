/**
 * 基于Ext源表格扩展出的数据表格，继承至Ext.grid.Panel
 * 
 * <pre>
 * 增加属性：
 *             enableCheckbox=true,
 *             // 记录选择模式: &quot;SINGLE&quot;/&quot;SIMPLE&quot;/&quot;MULTI&quot;
 *             selectionMode='MULTI'
 * 增加函数:
 *     Model[] getRecords():返回表中所有数据
 *     Model[] getSelectedRecords():返回所有选择的数据
 *     String[] getSelectedIds():返回所有选择的数据的ID
 *     reload():Store.reload()
 *     load():load()
 *     loadData():loadData()
 *     loadRecords():loadRecords()
 *     deselectAll：取消所有选取
 * </pre>
 */
Ext.define('Extend.grid.LazyLoadGridPanel', {
            extend : 'Extend.grid.ExtendGridPanel',
            alias : 'widget.ExtendGridPanel',
            mixins : ['Extend.toolbar.ToolbarsInit'],
            autoLoad : false,
            initComponent : function()
            {
                this.callParent(arguments);
                this.on({
                            afterrender : function()
                            {
                                if (!this.getStore().isLoaded() && !this.getStore().isLoading())
                                {
                                    this.getStore().reload();
                                }
                            }
                        })
            }
        });