Ext.define("Extend.window.ExportWindow", {
	extend : 'Extend.window.ExtendWindow',
	title : "导出",
	height : 200,
	width : 500,
	resizable : false,
	closable : false,
	modal : true,
	subscribes : [],
	config : {
		url : '',
		message : '点击确定开始导出数据，导出过程中请您耐心等待。'
	},
	initComponent : function() {
		var me = this;
		me.iframe = Ext.create('Ext.ux.IFrame', {
					hidden : true
				});
		me.buttons = ['->', {
					xtype : 'button',
					text : '确定',
					action : 'ok',
					handler : function() {
						var btnOk = this;
						if (me.progressBar) {
							me.progressBar.reset();
						}
						this.disable();
						var btnClose = me.down('button[action="close"]');
						btnClose.disable();
						btnOk.up('window').mask('准备导出...');
						Ext.defer(function() {
									btnOk.up('window').unmask();
									me.iframe.src = me.url;
									me.iframe.load();
								}, 4000);
					}
				}, {
					xtype : 'button',
					action : 'close',
					text : '关闭',
					handler : function() {
						me.close();
					}
				}];
		me.callParent(arguments);
		me.formPanel = Ext.create('Ext.form.Panel', {
			region : 'center',
			layout : 'column',
			timeout : 10 * 60 * 1000,
			defaults : {
				labelAlign : 'right',
				columnWidth : 1
			},
			bodyStyle : 'padding:10px;',
			items : [{
				xtype : 'panel',
				margin : 2,
				bodyStyle : 'border:1px solid #666;color:#666;padding:5px;line-height:20px;',
				html : me.message
			}]
		});
		me.add(me.formPanel);

		me.iframe = Ext.create('Ext.ux.IFrame', {
					hidden : true,
					region : 'west',
					height : 0,
					width : 0
				})
		me.add(me.iframe);
		me.on({
			afterlayout : function() {
				var me = this;
				if (!Ext.isEmpty(me.subscribes)) {

					me.progressBar = Ext.create('Ext.ProgressBar', {
								renderTo : me.getEl(),
								margin : '0 10 0 10',
								style : 'border:1px solid #000;'
							});
					me.progressBar.updateProgress(0);
					Ext.Array.each(me.subscribes, function(item) {
								if (Ext.isObject(item)) {
									app.message.subscribe(item.subscribe,
											item.callback);
								} else {
									app.message.subscribe(item, function(
													content) {
												if (content.current == 100
														|| content.data === '导出完成'
														|| content.data === 'DONE') {
													me
															.down('button[action="ok"]')
															.enable();
													me
															.down('button[action="close"]')
															.enable();
												}
												me.progressHandler.call(me,
														content)
											});
								}
							})
				}
			},
			close : function() {
				if (!Ext.isEmpty(me.subscribes)) {
					Ext.Array.each(me.subscribes, function(item) {
								app.message.unsubscribe(item);
							})
				}
			}
		});
	},
	progressHandler : function(content) {
		var total = content.total, current = content.current, percent;
		percent = Math.abs(current) / Math.abs(total);
		if (percent > 1) {
			percent = 1;
		}
		this.progressBar.updateProgress(percent, content.data
						|| Ext.util.Format.round(percent * 100, 2) + "%");
	},
	successHandler : function(form, action) {
		Extend.Msg.info("提示", action.result.result, action.result.messages);
	}
});
