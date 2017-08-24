/**
 * 表格时间列，格式： 'Y-m-d'
 */
Ext.define('Extend.grid.column.YmdColumn', {
            extend : 'Ext.grid.column.Date',
            alias : 'widget.ymdcolumn',
            format : 'Y-m-d'
        })