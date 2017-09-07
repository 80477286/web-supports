Ext.define('App.authorization.user.view.UserList', {
    extend: 'Extend.grid.CrudGridPanel',
    alias: 'widget.UserList',
    requires: ['App.authorization.user.UserViewModel'],
    viewModel: 'UserViewModel',
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
        model: 'App.authorization.user.UserModel',
        formClazz: 'App.authorization.user.view.UserEditor',
        save: 'authorization/user/save',
        get: 'authorization/user/get_by_id',
        del: 'authorization/user/delete',
        dataType: 'User'
    }
});