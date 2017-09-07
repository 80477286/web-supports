/**
 * 表格时间列，格式：'Y-m-d H:i'
 */
Ext.define('Extend.grid.column.YmdHiColumn', {
            extend : 'Ext.grid.column.Date',
            alias : ['widget.YmdHiColumn', 'widget.ymdhicolumn'],
            format : 'Y-m-d H:i'
        })