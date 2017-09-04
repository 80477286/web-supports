Ext.define('App.components.form.field.StatusComboBox', {
            extend : 'Ext.form.field.ComboBox',
            alias : 'widget.StatusComboBox',
            queryMode : 'local',
            displayField : 'name',
            valueField : 'value',
            editable : false,
            multiSelect : false,
            store : Ext.create('Ext.data.Store', {
                        fields : ['name', 'value'],
                        data : [['执行', 1], ['关闭', 0]]
                    })
        })