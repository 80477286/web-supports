Ext.define('Extend.form.field.BooleanComboBox', {
			extend : 'Ext.form.field.ComboBox',
			alias : ['widget.booleancombobox', 'widget.BooleanComboBox',
					'widget.BooleanCombobox'],
			editable : false,
			queryMode : 'local',
			valueField : 'value',
			displayField : 'name',
			store : Ext.create('Ext.data.Store', {
						fields : ['value', 'name'],
						data : [{
									value : true,
									name : "是"
								}, {
									value : false,
									name : "否"
								}]
					})
		});