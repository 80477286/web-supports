/**
 * 表格时间列，格式： 'H:i:s'
 */
Ext.define('Extend.grid.column.BooleanColumn', {
			extend : 'Ext.grid.column.Column',
			alias : ['widget.booleancolumn', 'widget.BooleanColumn'],
			renderer : function(v) {
				if (v == true || v == 1 || v == 'true' || v == 'TRUE'
						|| v == 'True') {
					return '是';
				} else {
					return '否';
				}
			}
		})