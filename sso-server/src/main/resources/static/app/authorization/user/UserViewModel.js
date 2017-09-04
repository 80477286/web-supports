Ext.define('App.authorization.user.UserViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.UserViewModel',
    requires: ['App.authorization.user.UserModel'],
    data: {
        columns: [{
            header: 'ID',
            dataIndex: 'id',
            hidden: true
        }, {
            header: '用户名',
            dataIndex: 'username'
        }, {
            header: '姓名',
            dataIndex: 'name'
        }, , {
            header: '锁定',
            dataIndex: 'locked'
        }, {
            xtype: 'YmdColumn',
            header: '帐号失效时间',
            dataIndex: 'accountExpiringDate'
        }, {
            xtype: 'YmdColumn',
            header: '密码失效时间',
            dataIndex: 'credentialsExpiringDate'
        }, {
            header: '创建人',
            dataIndex: 'creator',
            hidden: true
        }, {
            xtype: 'CdtColumn',
            header: '创建时间',
            dataIndex: 'cdt',
            hidden: true
        }],
        search: {
            simpleSearch: true,
            advancedSearch: true,
            fields: [{
                "field": "name",
                "name": "姓名",
                vtype: 's',
                opt: 'like'
            }, {
                "field": "username",
                "name": "用户名",
                vtype: 'tx',
                opt: 'like'
            }, {
                "field": "locked",
                "name": "锁定",
                vtype: 'bl',
                opt: '=',
                datas: [['是', true], ['否', false]]
            }]
        }
    },
    stores: {
        Query: {
            autoLoad: false,
            model: 'App.authorization.user.UserModel',
            pageSize: 25,
            remoteSort: true,
            sorters: [{
                property: 'cdt',
                direction: 'desc'
            }],
            proxy: {
                type: 'majax',
                url: '/authorization/user?query',
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    totalProperty: 'total'
                }
            }
        }
    }
});