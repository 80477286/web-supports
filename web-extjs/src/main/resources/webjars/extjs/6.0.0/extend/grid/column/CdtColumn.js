/**
 * 用于显示数据创建时间的控件，将会把创建时间的long数据转换为date数据
 */
Ext.define('Extend.grid.column.CdtColumn', {
			extend : 'Ext.grid.column.Column',
			alias : ['widget.cdtcolumn','widget.CdtColumn'],
			format : 'Y-m-d H:i:s',
			defaultRenderer : function(value) {
				if (!Ext.isEmpty(value)) {
					return Ext.Date.format(new Date(value), 'Y-m-d H:i:s');
				} else {
					return '';
				}
			}
		})