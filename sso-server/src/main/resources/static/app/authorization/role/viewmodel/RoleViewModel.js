Ext.define('App.authorization.role.viewmodel.RoleViewModel', {
            extend : 'Ext.app.ViewModel',
            alias : 'viewmodel.role_viewmodel',
            requires : ['App.authorization.role.model.RoleModel'],
            data : {
                columns : [{
                            header : 'ID',
                            dataIndex : 'id',
                            hidden : true
                        }, {
                            header : '角色名',
                            dataIndex : 'name'
                        }, {
                            header : '描述',
                            dataIndex : 'description'
                        }, {
                            header : '创建人',
                            dataIndex : 'creator',
                            hidden : true
                        }, {
                            xtype : 'cdtcolumn',
                            header : '创建时间',
                            dataIndex : 'cdt',
                            hidden : true
                        }],
                search : {
                    simpleSearch : true,
                    advancedSearch : true,
                    fields : [{
                                "field" : "name",
                                "name" : "角色名",
                                vtype : 's',
                                opt : 'like'
                            }, {
                                "field" : "description",
                                "name" : "描述",
                                vtype : 's',
                                opt : 'like'
                            }]
                }
            },
            stores : {
                Query : {
                    autoLoad : false,
                    model : 'App.authorization.role.model.RoleModel',
                    pageSize : 25,
                    remoteSort : true,
                    sorters : [{
                                property : 'cdt',
                                direction : 'desc'
                            }],
                    proxy : {
                        type : 'majax',
                        url : '/authorization/role?query',
                        reader : {
                            type : 'json',
                            rootProperty : 'data',
                            totalProperty : 'total'
                        }
                    }
                }
            }
        });