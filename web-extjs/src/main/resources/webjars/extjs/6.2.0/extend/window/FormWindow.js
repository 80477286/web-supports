
/**
 * ## loadRecord/load(remote)
 * 
 * @example
 * Ext.create('MExt.window.FormWindow', {
 *            url : 'authorization/user/save',
 *            items : [{
 *                        xtype : 'textfield',
 *                        fieldLabel : 'Username',
 *                        allowBlank : false,
 *                        name : 'username'
 *                    }],
 *        }).show({
 *            //此函数属性用于构建window，会merge MExt.window.FormWindow.window配置项
 *            modal : false
 *        }).load({
 *            url : 'authorization/user/load',
 *            params : {
 *                id : '05c0d3d1-b6b8-49b9-808c-0264d3197e34'
 *            }
 *        });
 * 
 * Ext.create('MExt.window.FormWindow', {
 *           url : 'authorization/user/save',
 *           items : [{
 *                       xtype : 'textfield',
 *                       fieldLabel : 'Username',
 *                       allowBlank : false,
 *                       name : 'username'
 *                  }],
 *           window:{
 *             //此属性用于构建window,会merge内置配置项
 *              modal : false,
 *              buttons:{
 *                  reset:{
 *                      hidden:true
 *                  }
 *              }
 *           }
 *      }).show().loadRecord(Ext.create('Ext.data.Model', {
 *          username : 'test'
 *      }));
 * 
 * 
 * 
 */

Ext.define('Extend.window.FormWindow', {
	extend : 'Ext.form.Panel',
	alias : 'widget.FormWindow',
	requires : ['Extend.form.Basic'],
	region : 'center',
	scrollable : true,
	layout : 'column',
	config : {
		isEdit : true,
		unmaskable : true,
		loadMaskText : '加载...',
		saveMaskText : '保存...',
		model : 'Ext.data.Model',
		rootProperty : 'data',
		closeBySave : true,
		recordable : false,// 是否支持修改记录
		targetGrid : null,
		submitEmptyText : false,
		defaults : {
			margin : 5,
			columnWidth : .5,
			labelAlign : 'right',
			labelWidth : 100
		},
		window : {
			iconCls : 'edit',
			minWidth : 300,
			minHeight : 150,
			layout : 'border',
			modal : false,
			resizable : false,
			listeners : {
				afterrender : function() {
					if (this.form.isEdit == true) {
						if (Ext.isEmpty(app.editors)) {
							app.editors = {};
						}
						app.editors[this.id] = this
					}
				},
				close : function() {
					try {
						delete app.editors[this.id];
					} catch (e) {
						Ext.log({
									msg : '移除数据编辑器出现异常',
									level : 'error',
									stack : e
								})
					}
				}
			},
			buttons : {
				save : {
					text : '保存',
					iconCls : 'save',
					index : 0,
					height : 30,
					handler : function(btn, e) {
						var me = this.up('window').form;
						me.saveHandler();
					}
				},
				reset : {
					text : '重置',
					iconCls : 'reset',
					index : 1,
					height : 30,
					hidden : true,
					handler : function(btn, e) {
						this.up('window').form.reset(btn, e);
					}
				},
				cancel : {
					text : '取消',
					iconCls : 'cancel',
					index : 2,
					height : 30,
					handler : function(btn, e) {
						this.up('window').form.cancel(btn, e);
					}
				}
			}
		}
	},
	createForm : function() {
		var cfg = {}, props = this.basicFormConfigs, len = props.length, i = 0, prop;
		for (; i < len; ++i) {
			prop = props[i];
			cfg[prop] = this[prop];
		}
		cfg["entity"] = this['entity'];
		return new Extend.form.Basic(this, cfg);
	},
	initEvents : function() {
		var me = this;
		this.on({
			actionfailed : function(formbase, action, eOpts) {
				this.window.unmask();
				Extend.Msg
						.error(
								'错误',
								action.result.result
										|| ('操作发生错误:' + (this.action === 'save'
												? action.form.url
												: (action.form.get
														|| action.form.load || action.form.read))),
								action.result.messages, action.result.errors,
								action.result.exception)
				this.fireEvent(this.action === 'load'
								? 'loadfailure'
								: 'savefailure', formbase, action)
			},
			actioncomplete : function(formbase, action, eOpts) {
				if (this.unmaskable === true) {
					this.window.unmask();
				}
				if (this.action === 'load') {
					this.fireEvent('load', formbase, action)
					var record = Ext.create(me.model
									|| 'Extend.data.IdentityModel',
							action.result[this.rootProperty]);
					this.loadRecord(record);
				} else {
					if (!Ext.isEmpty(this.targetGrid)) {
						if (Ext.isFunction(this.targetGrid.deselectAll)) {
							this.targetGrid.deselectAll();
						}
						if (Ext.isFunction(this.targetGrid.reload)) {
							this.targetGrid.reload();
						}
					}
					this.fireEvent('save', formbase, action)
					if (this.closeBySave) {
						this.window.close();
					}
				}
			},
			beforeaction : function(formbase, action, eOpts) {
				if (this.action === 'load') {
					this.window.mask(this.loadMaskText);
				} else {
					this.window.mask(this.saveMaskText);
				}
			}
		});
		this.callParent(arguments);
	},
	getParams : Ext.emptyFn,
	cancel : function(btn, e) {
		this.window.close();
	},
	createWindow : function(options) {
		var me = this;

		Ext.merge(this.window, options);
		// 初始化按钮
		this.initButtons(this.window);
		// 设置form为center显示

		this.window.items = this;
		this.window = Ext.create('Extend.window.ExtendWindow', this.window)
		this.window.form = this;
		this.window.setTitle(this.window.title || this.title || '编辑');
		this.window.setIconCls(this.window.iconCls || this.iconCls);
		this.setTitle(null);
		this.setIconCls(null);
		return this.window;
	},
	initButtons : function(config) {
		if (Ext.isEmpty(config.buttons)) {
			return;
		}
		if (Ext.isObject(config.buttons)) {
			if (!(config.buttons instanceof Ext.Toolbar)) {
				var btns = [];
				Ext.Object.each(config.buttons, function(key, value) {
							value.action = key;
							btns.push(value);
						})
				btns = Ext.Array.sort(btns, function(a, b) {
					a.index = Ext.isEmpty(a.index) ? Number.MAX_VALUE : a.index;
					b.index = Ext.isEmpty(b.index) ? Number.MAX_VALUE : b.index;
					return (a.index === b.index) ? 0 : ((a.index < b.index)
							? -1
							: 1);
				})
				config.buttons = btns;
			}
		}
	},
	show : function(options) {
		this.createWindow(options).show();
		return this;
	},
	load : function(opts) {
		this.action = 'load';
		if (Ext.isEmpty(opts.url)) {
			opts.url = this.api ? this.api.load : null;
		}
		if (Ext.isEmpty(opts.url)) {
			Extend.Msg.error('错误', '无法加载需要编辑的数据，未配置URL地址！')
			return;
		}
		this.callParent(arguments);
	},
	loadRecord : function(record) {
		if (Ext.isEmpty(record)) {
			Extend.Msg.error('错误', '无法加载需要编辑的数据，目标数据为空！')
			return;
		}
		if (!(record instanceof Ext.data.Model)) {
			record = Ext.create(this.model || 'Ext.data.Model', record)
			record.set('id', null);
		} else {
			var cloneData = Ext.clone(record.data)
			var cr = Ext.create(record.$className, cloneData);
			if (!Ext.isEmpty(cr.get('id')) && cr.get('id').indexOf('-') > -1) {
				cr.set('id', null);
			}
			arguments[0] = cr;
		}
		if (this.quickCreate === true) {
			record.set('id', null);
		}

		this.callParent(arguments);
	},
	close : function() {
		this.window.close();
	},
	getDatas : function(asString, dirtyOnly, includeEmptyText, useDataValues,
			isSubmitting) {
		return this.getForm().getDatas();
	},
	saveHandler : function() {
		var me = this;
		var grids = this.query('grid');
		if (Ext.isEmpty(roweditor)) {
			for (var i = 0; i < grids.length; i++) {
				var grid = grids[i];
				var roweditor = grid.findPlugin('rowediting');
				if (!Ext.isEmpty(roweditor) && roweditor.editing === true) {
					Extend.Msg.error('错误', '表单“' + grid.getTitle()
									+ '”正处于编辑状态，请结束编辑后重试！')
					return;
				}
			}
		}
		if (me.isValid()) {
			if (me.recordable === true) {
				Ext.Msg.show({
					title : '描述信息',
					message : "请输入添加或修改数据的描述信息，此信息必填（长度小于1024）",
					buttons : Ext.Msg.OKCANCEL,
					multiline : 30,
					minWidth : 500,
					callback : function(opts, value) {
						if (opts === 'ok') {
							if (Ext.isEmpty(value)) {
								Extend.Msg.error('错误', "描述信息必须填写，请重新保存！");
								return;
							};
							me.action = 'save';
							var params = {
								submitEmptyText : me.submitEmptyText,
								params : Ext.apply({
											'operationRecord.description' : value
										}, me.getParams())
							}
							me.up('window').form.submit(params);
						}
					}
				});
			} else {
				me.action = 'save';
				var params = {
					submitEmptyText : me.submitEmptyText,
					params : me.getParams()
				}
				me.up('window').form.submit(params);
			}
		}
	}
})