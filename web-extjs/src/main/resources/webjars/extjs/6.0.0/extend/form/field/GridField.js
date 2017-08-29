Ext.define('Extend.form.field.GridField', {
	extend : 'Extend.grid.SelectedGridPanel',
	mixins : ['Ext.form.field.Base'],
	alias : ['widget.gridfield', 'widget.GridField'],
	border : true,
	columnLines : true,
	height : 200,
	config : {
		/**
		 * 例1：['name','id'] 每个字符串即是表格中对应的属性，也是提交到后台实体中的属性名
		 * 
		 * 例2：[{column:'name',field:'tcname'},{column:'id',field:'id'}]
		 * column为表格中对应的列名，field为提交到后台实体中的属性名
		 * 
		 * 例3：[{column:'name',field:'tcname',valueList:true}]
		 * 在只有一个提交字段，并且valueList=true的情况下，后台List对应:List<String>,List<Integer>....
		 * 
		 * 
		 * @type
		 */
		submitFields : []
	},
	initToolbar : function() {
		if (!Ext.isEmpty(this.tbar)) {
			var title = '<span style="font-weight:bold;">'
					+ (this.fieldLabel || "") + '</span>';
			if (Ext.isArray(this.tbar)) {
				Ext.Array.insert(this.tbar, 0, [title])
			} else if (this.tbar instanceof Ext.toolbar.Toolbar) {
				this.tbar.insert(0, [title])
			}
		}
	},
	initComponent : function() {
		this.callParent(arguments)
		var tbars = this.getDockedItems('toolbar[dock="top"]');
		if (tbars.length > 0) {
			var title = '<span style="font-weight:bold;">'
					+ (this.fieldLabel || "") + '</span>';
			tbars[0].insert(0, title)
		}
	},
	getSubmitData : function() {
		return this.getValue();
	},
	getModelData : function() {
		return this.getValue();
	},
	setValue : function(v) {
		if (Ext.isEmpty(v)) {
			this.getStore().removeAll();
		}
		this.loadData(v, false);
	},
	getValue : function() {
		var me = this;
		if (me.submitValue === false) {
			return null;
		}
		var data = null;
		if (!me.disabled) {
			var rs = me.getRecords();
			if (rs.length > 0) {
				data = {};
				var sfs = me.getSubmitFields();
				if (!Ext.isEmpty(sfs) && sfs.length > 0) {
					for (var i = 0; i < rs.length; i++) {
						var record = rs[i].data;
						for (var j = 0; j < sfs.length; j++) {
							var sf = sfs[j];
							if (!Ext.isObject(sf)) {
								sf = {
									field : sf,
									column : sf,
									valueList : false
								};
							}
							if (sfs.length > 1) {
								sf.valueList = false;
							}
							var values = this._getValuesBySubmitField(record,
									sf, i);
							for (var key in values) {
								var paramName = sf.valueList == true ? (me
										.getName()) : (me.getName() + '[' + i
										+ '].' + key);
								if (Ext.isEmpty(data[paramName])) {
									data[paramName] = [];
								}
								data[paramName].push(values[key]);
							}
						}
					}
				} else {
					Ext.log.warn('未配置提交字段列表属性:submitFields')
				}
			}
		}
		return data;
	},
	_getValuesBySubmitField : function(data, sf, index) {
		var me = this;
		var values = {};
		if (sf.column === 'index') {
			if (!Ext.isEmpty(index)) {
				values[sf.field] = index;
			}
		} else {
			if (sf.column.indexOf('.') == -1) {
				if (!Ext.isEmpty(data[sf.column])) {
					values[sf.field] = data[sf.column];
				}
			} else if (sf.column.indexOf('.') > -1) {

				var head = sf.column.substring(0, sf.column.indexOf('.'));
				var end = sf.column.substring(sf.column.indexOf('.') + 1,
						sf.column.length);
				var headField = sf.column.substring(0, sf.column.indexOf('.'));
				var endField = sf.column.substring(sf.column.indexOf('.') + 1,
						sf.column.length);

				var headValue = data[head];
				if (Ext.isEmpty(headValue)) {
					return values;
				}
				var endsf = {
					column : end,
					field : endField
				}
				if (Ext.isArray(headValue)) {

					if (headValue.length > 0) {
						for (var i = 0; i < headValue.length; i++) {
							var tmp = me._getValuesBySubmitField(headValue[i],
									endsf, i);
							for (var key in tmp) {
								values[headField + '[' + i + '].' + key] = tmp[key];
							}
						}
					}
				} else if (Ext.isObject(headValue)) {
					var tmp = me._getValuesBySubmitField(headValue, endsf);
					for (var key in tmp) {
						values[headField + '.' + key] = tmp[key];
					}
				}
			}
		}
		return values;
	},
	getSubmitFields : function() {
		if (!Ext.isEmpty(this.submitFields) && Ext.isArray(this.submitFields)
				&& this.submitFields.length > 0) {
			return this.submitFields;
		}
		return null;
	}
});
