/**
 * 内存仓库数据表格，继承至Extend.grid.ExtendedGridPanel
 * 
 * <pre>
 * 此类自动创建一个内存仓库.
 * 增加属性：
 *      model='Ext.data.Model'：数据模型
 * 加事件:
 *      add:添加按钮点击后激活
 *      boolean delete(rs)：移除按钮点击后激活
 * </pre>
 */
Ext.define('Extend.grid.MemoryGridPanel', {
            extend : 'Extend.grid.ExtendGridPanel',
            alias : 'widget.MemoryGridPanel',
            config : {
                pageable : false
            },
            store : {
                autoLoad : false,
                proxy : {
                    type : 'memory',
                    reader : {
                        type : 'json'
                    }
                }
            },
            initComponent : function()
            {
                if (Ext.isEmpty(this.model))
                {
                    Ext.log.warn('表格需要配置正确的model属性(用于store中的model)，以免出现行编辑时不能正确保存数据问题！')
                    this.model = 'Ext.data.Model';
                }
                if (this.store)
                {
                    this.store.model = this.model;
                }
                this.callParent(arguments);
            }
        });