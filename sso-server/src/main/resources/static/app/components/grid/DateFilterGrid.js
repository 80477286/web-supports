Ext.define('App.components.grid.DateFilterGrid', {
			extend : 'Extend.grid.CrudGridPanel',
			alias : 'widget.DateFilterGrid',
			config : {
				tbar : {
					sd : {
						xtype : 'combobox',
						itemId : 'month',
						fieldLabel : '月份',
						labelAlign : 'right',
						displayField : 'month',
						valueField : 'month',
						labelWidth : 40,
						width : 180,
						index : -100,
						editable : false,
						queryMode : 'local',
						store : {
							fields : ['month'],
							data : []
						},
						value : Ext.util.Format.date(Ext.Date.add(new Date(),
										Ext.Date.MONTH, -1), 'Ym'),
						listeners : {
							change : function() {
								this.up('grid').reload();
							},
							afterrender : function() {
								var months = [];
								var dt = new Date()
								for (var i = -6; i++; i <= 0) {
									var ym = Ext.util.Format.date(Ext.Date.add(
													dt, Ext.Date.MONTH, i),
											'Ym');
									months.push({
												month : ym
											});
								}
								this.getStore().loadData(months, false);
							}
						}
					}
				}
			},
			getExtraParams : function() {
				var ym = this.down('combobox[itemId="month"]').getValue();
				if (Ext.isEmpty(ym)) {
					ym = Ext.util.Format.date(Ext.Date.add(new Date(),
									Ext.Date.MONTH, -1), 'Ym');
				}
				return {
					'params.month_i_eq' : ym
				};
			}
		});