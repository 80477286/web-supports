Ext.Loader.setConfig({
    enabled: true,
    disableCachingParam: 'dc',
    disableCaching: isDebug === true ? true : false,
    paths: {// '类名前缀':'所在路径'
        'Extend': 'webjars/extjs/6.2.0/extend',
        'MExt': 'webjars/extjs/6.2.0/extend',
        'Ext.ux': 'webjars/extjs/6.2.0/packages/ux/classic/src'
    }
});
Ext.state.Manager.setProvider(new Ext.state.LocalStorageProvider());
Ext.require(['Extend.window.MessageBox', 'Extend.Utils', 'Extend.grid.column.BooleanColumn',
    'Extend.grid.column.HisColumn', 'Extend.grid.column.YmdColumn',
    'Extend.grid.column.YmdHiColumn',
    'Extend.grid.column.YmdHisColumn',
    'Extend.form.field.BooleanComboBox', 'Extend.form.field.GridField',
    'Extend.form.field.CheckCombo', 'Extend.form.field.TreeComboBox',
    'Extend.form.field.YmdDateField', 'Extend.form.field.MonthField']);
Ext.tip.QuickTipManager.init();