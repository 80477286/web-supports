Ext.Loader.setConfig({
    enabled: true,
    disableCachingParam: 'dc',
    disableCaching: isDebug === true ? true : false,
    paths: {// '类名前缀':'所在路径'
        'Extend': '/webjars/extjs/6.0.0/extend',
        'MExt': '/webjars/extjs/6.0.0/extend',
        'Ext.ux': '/webjars/extjs/6.0.0/packages/ux/classic/src'
    }
});
Ext.state.Manager.setProvider(new Ext.state.LocalStorageProvider());
Ext.require(['Extend.window.MessageBox', 'Extend.Utils']);
Ext.tip.QuickTipManager.init();