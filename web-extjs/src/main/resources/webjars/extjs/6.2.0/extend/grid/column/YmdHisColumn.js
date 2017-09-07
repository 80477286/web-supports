/**
 * 表格时间列，格式： 'Y-m-d H:i:s'
 */
Ext.define('Extend.grid.column.YmdHisColumn', {
            extend : 'Ext.grid.column.Date',
            alias : ['widget.YmdHisColumn', 'widget.ymdhisCcolumn'],
            format : 'Y-m-d H:i:s'
        })