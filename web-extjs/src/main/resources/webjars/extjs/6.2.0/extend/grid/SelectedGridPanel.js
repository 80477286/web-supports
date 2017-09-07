/**
 * 选择后的数据表格，继承至Extend.grid.MemoryGridPanel
 * 
 * <pre>
 * 增加属性：
 *      btnRemoveText='移除',
 *      btnAddText='添加'
 * 增加事件:
 *      beforeadd:添加数据函数之后激活
 *      boolean beforedelete(rs)：删除数据函数之前调用
 * 增加函数：
 *      doAdd:添加数据函数
 *      doDelete：删除数据
 * </pre>
 */
Ext.define('Extend.grid.SelectedGridPanel', {
			extend : 'Extend.grid.MemoryGridPanel',
			alias : 'widget.SelectedGridPanel',
			viewConfig : {
				plugins : {
					ptype : 'gridviewdragdrop',
					dragText : '拖动目标到你想要的位置松开鼠标。'
				}
			},
			config : {
				roweditable : false,
				roweditFirstColumn : 1,
				tbar : {
					add : {
						text : '添加',
						index : 1,
						handler : function() {
							var me = this.up('SelectedGridPanel');
							me.addHandler.call(me);
						}
					},
					edit : {
						text : '编辑',
						index : 2,
						hidden : true,
						disabled : true,
						handler : function() {
							var me = this.up('SelectedGridPanel');
							var records = me.getSelectedRecords();
							if (records.length == 1) {
								me.editHandler.call(me, records[0]);
							}
						}
					},
					remove : {
						text : '移除',
						index : 3,
						disabled : true,
						handler : function() {
							var me = this.up('SelectedGridPanel');
							var rs = me.getSelectedRecords();
							if (rs.length > 0) {
								me.deleteHandler.call(me, rs);
							}
						}
					}
				}
			},
			initComponent : function() {
				var me = this;
				if (Ext.isEmpty(this.plugins)) {
					this.plugins = [];
				}
				if (this.roweditable === true) {
					this.plugins.push({
								clicksToMoveEditor : false,
								ptype : 'rowediting',
								clicksToEdit : false,
								saveBtnText : '保存',
								cancelBtnText : "取消",
								errorSummary : false
							});
				}
				this.callParent(arguments);
			},
			initEvents : function() {
				this.on({
							beforeedit : function(editor, e, eOpts) {
								try {
									this.up('window')
											.down('button[iconCls="save"]')
											.disable();
								} catch (e) {
								}
							},
							edit : function() {
								try {
									this.up('window')
											.down('button[iconCls="save"]')
											.enable();
								} catch (e) {
								}
							},
							canceledit : function($this, context, eOpts) {
								var me = this;
								var record = context.record;
								if (record.get('id').indexOf('-') > -1) {
									$this.editor.up('SelectedGridPanel')
											.getStore().remove(record);
								}
								try {
									this.up('window')
											.down('button[iconCls="save"]')
											.enable();
								} catch (e) {
								}
							},
							itemdblclick : function($this, record, item, index,
									e, eOpts) {
								this.editHandler(record);
							},
							selectionchange : function($this, selected, eOpts) {
								var btnEdit = this
										.down('button[action="edit"]');
								var btnRemove = this
										.down('button[action="remove"]');
								if (selected.length > 0) {
									if (selected.length == 1) {
										if (btnEdit) {
											btnEdit.enable();
										}
									} else {
										if (btnEdit) {
											btnEdit.disable();
										}
									}
									if (btnRemove) {
										btnRemove.enable();
									}
								} else {
									if (btnRemove) {
										btnRemove.disable();
									}
									if (btnEdit) {
										btnEdit.disable();
									}
								}
							}
						});
				this.callParent(arguments);
			},
			addHandler : function() {
				var rowedit = this.findPlugin('rowediting');
				if (rowedit) {
					if (rowedit.editing !== true) {
						var record = Ext.create(this.model, {});
						this.getStore().loadRecords([record], {
									addRecords : true
								})
						rowedit.startEdit(record, this.roweditFirstColumn || 1)
					}
				} else {
					this.editHandler(Ext.create(this.model, {}));
				}
			},
			editHandler : function(record) {
				var rowedit = this.findPlugin('rowediting');
				if (rowedit) {
					if (rowedit.editing !== true) {
						if (!Ext.isEmpty(record.get('id'))) {
							record.set('id', record.get('id').replace(/[-]/g,
											''));
						}
						rowedit.startEdit(record, this.roweditFirstColumn || 1)
					}
				}
			},
			deleteHandler : function(rs) {
				this.getStore().remove(rs);
				this.deselectAll();
			}
		});