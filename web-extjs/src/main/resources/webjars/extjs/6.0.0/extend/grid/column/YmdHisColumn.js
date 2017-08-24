/**
 * 表格时间列，格式： 'Y-m-d H:i:s'
 */
Ext.define('Extend.grid.column.YmdHisColumn', {
			extend : 'Ext.grid.column.Date',
			alias : 'widget.YmdHisColumn',
			format : 'Y-m-d H:i:s',
			defaultRenderer : function(value) {
				if (Ext.isEmpty(value)) {
					return value;
				}
				if (Ext.isString(value)) {
					// 解决在日期中如果带T则与源数据相差8小时问题
					value = value.replace(/T/g, ' ');
				}
				return Ext.util.Format.date(value, this.format);
			}
		})