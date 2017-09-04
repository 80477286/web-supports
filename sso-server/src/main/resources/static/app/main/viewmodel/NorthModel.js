Ext.define('App.main.viewmodel.NorthModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.NorthModel',
    data: {
        user: {
            name: '加载中...'
        },
        menus: [{
            name: '用户管理',
            clazz: 'App.authorization.user.view.UserList',
            iconCls: 'menu_item_user_managument'
        }, {
            name: '资源管理',
            clazz: 'App.authorization.resource.view.ResourceList',
            iconCls: 'menu_item_resource_managument'
        }, {
            name: '角色管理',
            clazz: 'App.authorization.role.view.RoleList',
            iconCls: 'menu_item_role_managument'
        }]
    }
})