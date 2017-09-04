/**
 * 用于显示数据创建时间的控件，将会把创建时间的long数据转换为date数据
 */
Ext.define('App.components.grid.column.KpiColumn', {
	extend : 'Ext.grid.column.Column',
	alias : ['widget.KpiColumn', 'widget.kpicolumn'],

	bindFormatter : function(format) {
		var me = this;
		return function(value, metaData, record, rowIndex, colIndex, store,
				view) {

			var val = format.format(value, format.scope || me.rendererScope
							|| me.resolveListenerScope());
			var cc = this.getColumns()[colIndex];
			var targetValue = cc.kpi.targetValue;
			if (!Ext.isEmpty(targetValue) && Ext.isNumeric(value)) {
				if (Ext.isNumeric(targetValue) || targetValue.indexOf('=') > -1) {
					var targetValue = targetValue.replace('=', '');
					if (value != Ext.Number.from(targetValue)) {
						val = '<div style="color:red;" title="目标/基线：'
								+ cc.kpi.targetValue + '">' + val + '</div>';
					}
				} else if (targetValue.indexOf(',') > -1) {
					var subs = targetValue.split(',');
					subs[0] = Ext.Number.from(subs[0]);
					subs[1] = Ext.Number.from(subs[1]);

					if (value < subs[0] || value > subs[1]) {
						val = '<div style="color:red;" title="目标/基线：'
								+ cc.kpi.targetValue + '">' + val + '</div>';
					}
				} else if (targetValue.indexOf('<') > -1) {
					var targetValue = targetValue.replace('<', '');
					if (value >= Ext.Number.from(targetValue)) {
						val = '<div style="color:red;" title="目标/基线：'
								+ cc.kpi.targetValue + '">' + val + '</div>';
					}
				} else if (targetValue.indexOf('>') > -1) {
					var targetValue = targetValue.replace('>', '');
					if (value <= Ext.Number.from(targetValue)) {
						val = '<div style="color:red;" title="目标/基线：'
								+ cc.kpi.targetValue + '">' + val + '</div>';
					}
				} else if (targetValue.indexOf('<=') > -1) {
					var targetValue = targetValue.replace('<=', '');
					if (value > Ext.Number.from(targetValue)) {
						val = '<div style="color:red;" title="目标/基线：'
								+ cc.kpi.targetValue + '">' + val + '</div>';
					}
				} else if (targetValue.indexOf('>=') > -1) {
					var targetValue = targetValue.replace('>=', '');
					if (value < Ext.Number.from(targetValue)) {
						val = '<div style="color:red;" title="目标/基线：'
								+ cc.kpi.targetValue + '">' + val + '</div>';
					}
				}
			}
			return val;
		};
	},
	bindRenderer : function(renderer) {
		var me = this;

		// <debug>
		if (renderer in Ext.util.Format) {
			Ext.log.warn('Use "formatter" config instead of "renderer" to use '
					+ 'Ext.util.Format to format cell values');
		}
		// </debug>

		me.hasCustomRenderer = true;

		return function(value, metaData, record, rowIndex, colIndex, store,
				view) {
			// if (rowIndex == 0)
			// {
			// return value;
			// }

			var val = Ext
					.callback(renderer, me.rendererScope, arguments, 0, me);
			return val;
		};
	}
})