Ext.define("Extend.tree.Panel", {
	extend : "Ext.tree.Panel",
	mixins : ['Extend.toolbar.ToolbarsInit'],
	hideHeaders : true,
	rootVisible : true,
	sortableColumns : false,
	config : {
		viewReady : false,
		pageable : false,
		lines : true,
		multiCheck : true,
		viewConfig : {
			loadingText : "加载...",
			loadMask : false,
			enableTextSelection : true
		},
		selModel : {
			xtype : 'rowmodel',
			mode : 'SINGLE'
		},
		paging : {
			hidden : true,
			xtype : 'pagingtoolbar',
			displayInfo : true,
			dock : 'bottom',
			style : {
				'padding' : '2px 0px 2px 8px'
			}
		}
	},
	constructor : function(config) {
		var me = this;
		this.callParent(arguments);
		me.store.proxy.actionMethods = {
			read : 'POST',
			create : 'POST',
			update : 'POST',
			destroy : 'POST'
		};
	},

	initComponent : function()// 重写初始化组件函数
	{
		var me = this;
		this.toolbarsInit(['tbar', 'bbar', 'lbar', 'fbar', 'rbar']);
		this.callParent();

		this.on({
			itemclick : function(view) {
				view.toggleOnDblClick = false;
			},
			beforeitemexpand : function(node, opts) {
				if (node.isRoot() && me.rootVisible === false) {
					me.setRootVisible(true);
				}
				return true;
			},
			afteritemexpand : function(node, index, item, eOpts) {
				if (node.isRoot() && me.rootVisible === false) {
					me.setRootVisible(false);
				}
			},
			afterrender : function() {
				Ext.defer(function() {
							if (me.getStore().isLoaded() == false
									&& me.isVisible()) {
								me.mask(me.viewConfig.loadingText)
							}
						}, 10)

			},
			checkchange : function(node, checked, eOpts) {
				if (this.multiCheck !== true) {
					var nodes = this.getChecked();
					Ext.Array.each(nodes, function(item) {
						if (item.get('id') != node.get('id') || checked != true) {
							item.set('checked', false)
						}
					})
				}
			}
		});
		this.initPaging();
		this.store.on({
					beforeload : function() {
						if (me.unmaskTask != null) {
							me.unmaskTask.cancel();
							me.unmaskTask = null;
						}
						if (!me.isMasked() && me.isVisible()) {
							me.mask(me.viewConfig.loadingText);
						}
					},
					load : function() {
						if (me.isMasked() && me.isVisible()) {
							if (me.unmaskTask != null) {
								me.unmaskTask.cancel();
								me.unmaskTask = null;
							}
							me.unmaskTask = new Ext.util.DelayedTask(
									function() {
										me.unmask();
									});
							me.unmaskTask.delay(500);
						}
					}
				});
	},
	initPaging : function() {
		if (this.pageable === true) {
			this.paging.store = this.store;
			this.paging = Ext.create('Ext.toolbar.Paging', this.paging)
			this.addDocked(this.paging);
		}
	},
	getExpanded : function(node) {
		var expandeds = [];
		if (node.isExpanded()) {
			expandeds.push(node.getPath())
			if (node.childNodes && Ext.isArray(node.childNodes)) {
				for (var i = 0; i < node.childNodes.length; i++) {
					var n = node.childNodes[i];
					var arr = this.getExpanded(n)
					if (arr.length > 0) {
						Ext.Array.push(expandeds, arr);
					}
				}
			}
		}
		return expandeds;
	},
	getLastSelected : function() {
		return this.getSelectionModel().getLastSelected();
	},
	onViewReady : function() {
		this.setViewReady(true);
		this.callParent(arguments);
	},
	setLines : function(val) {
		this.lines = val;
		if (val === true) {
			this.addCls(Ext.baseCSSPrefix + 'tree-lines');
		} else {
			this.removeCls(Ext.baseCSSPrefix + 'tree-lines');
		}
	},
	setRootVisible : function(val) {
		this.getStore().setRootVisible(val);
	},
	getCheckedIds : function(node) {
		var ids = [];
		var nodes = this.getChecked();
		if (!Ext.isEmpty(nodes) && nodes.length > 0) {
			Ext.Array.each(nodes, function(item) {
						if (!Ext.isEmpty(node)) {
							if (Ext.String.startsWith(item.getPath(), node
											.getPath())) {
								ids.push(item.get('id'));
							}
						} else {
							ids.push(item.get('id'));
						}
					})
		}
		return ids;
	},
	getChecked : function(node) {
		var nodes = this.callParent(arguments);
		var list = [];
		if (!Ext.isEmpty(nodes) && nodes.length > 0) {
			Ext.Array.each(nodes, function(item) {
						if (!Ext.isEmpty(node)) {
							if (Ext.String.startsWith(item.getPath(), node
											.getPath())) {
								list.push(item);
							}
						} else {
							list.push(item);
						}
					})
		}
		return list;
	},
	getSelectedIds : function() {
		var ids = [];
		var nodes = this.getSelection();
		for (var i = 0; i < nodes.length; i++) {
			ids.push(nodes[i].get('id'));
		}
		return ids;
	},
	getPath : function(record, nameField) {
		var path = '';
		if (record.parentNode && !record.parentNode.isRoot()) {
			var path = this.getPath(record.parentNode, nameField || 'name'
							|| 'text');
		}
		if (Ext.isEmpty(path)) {
			return record.get(nameField);
		} else {
			var cp = path + ' > ' + record.get(nameField || 'name' || 'text');
			return cp;
		}
	}
})