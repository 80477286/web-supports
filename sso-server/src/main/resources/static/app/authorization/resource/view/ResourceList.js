Ext.define('App.authorization.resource.view.ResourceList', {
    extend: 'Extend.grid.CrudGridPanel',
    alias: 'widget.ResourceList',
    requires: ['App.authorization.resource.ResourceViewModel'],
    viewModel: 'ResourceViewModel',
    config: {
        tbar: {
            quickCreate: {
                hidden: true
            }
        }
    },
    bind: {
        store: '{Query}',
        columns: '{columns}',
        search: '{search}'
    },
    editor: {
        formClazz: 'App.authorization.resource.view.ResourceEditor',
        save: '/authorization/resource?save',
        get: '/authorization/resource?get_by_id',
        del: '/authorization/resource?delete',
        dataType: 'Resource'
    }
});