Ext.define("App.authorization.role.view.RoleEditor", {
	extend : 'Extend.window.FormWindow',
	alias : 'widget.role_editor',
	config : {
		window : {
			title : '修改角色信息',
			width : 1024,
			height : 600
		},
		entity : 'role'
	},
	defaults : {
		columnWidth : 1
	},
	items : [{
				xtype : 'hidden',
				name : 'id'
			}, {
				xtype : 'textfield',
				name : 'name',
				fieldLabel : '角色名',
				allowBlank : false,
				blankText : '角色名不能为喔！',
				beforeLabelTextTpl : ['<span style="color:red;">*</span>'],
				maxLength : 32
			}, {
				xtype : 'textfield',
				name : 'description',
				fieldLabel : '描述',
				maxLength : 512
			}, {
				name : 'users',
				xtype : 'gridfield',
				fieldLabel : '用户配置',
				columnWidth : 1,
				height : 210,
				readOnly : false,
				submitFields : ['id', 'name'],
				addHandler : function() {
					var grid = this;
					Ext.create('Extend.window.SelectionWindow', {
								height : 500,
								grid : 'App.authorization.user.view.UserSelection',
								listeners : {
									selected : function(rs) {
										grid.loadRecords(rs, true);
									}
								}
							}).show();
				},
				columns : [{
							header : '姓名',
							dataIndex : 'name'
						}, {
							header : '用户名',
							dataIndex : 'username'
						}, {
							header : '锁定',
							dataIndex : 'locked'
						}]
			}, {
				name : 'resources',
				xtype : 'gridfield',
				fieldLabel : '资源配置',
				height : 210,
				readOnly : false,
				submitFields : ['id', 'name'],
				addHandler : function() {
					var grid = this;
					Ext.create('Extend.window.SelectionWindow', {
						height : 500,
						grid : 'App.authorization.resource.view.ResourceSelection',
						listeners : {
							selected : function(rs) {
								grid.loadRecords(rs, true);
							}
						}
					}).show();
				},
				columns : [{
							header : '资源名称',
							dataIndex : 'name'
						}, {
							header : 'URL',
							dataIndex : 'url'
						}]
			}]
})
