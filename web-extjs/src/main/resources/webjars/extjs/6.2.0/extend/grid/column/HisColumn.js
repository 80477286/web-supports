/**
 * 表格时间列，格式： 'H:i:s'
 */
Ext.define('Extend.grid.column.HisColumn', {
            extend : 'Ext.grid.column.Date',
            alias : ['widget.HisColumn', 'widget.hiscolumn'],
            format : 'H:i:s'
        })