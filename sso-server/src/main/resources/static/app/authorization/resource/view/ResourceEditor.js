Ext.define("App.authorization.resource.view.ResourceEditor", {
            extend : 'Extend.window.EditWindow',
            alias : 'widget.resource_editor',
            config : {
                entity : 'resource',
                defaults : {
                    columnWidth : 1
                },
                window : {
                    title : '修改资源信息',
                    width : 800,
                    height : 500,
                    resizable : false
                }
            },
            items : [{
                        xtype : 'hidden',
                        name : 'id'
                    }, {
                        xtype : 'textfield',
                        name : 'name',
                        fieldLabel : '资源名称',
                        allowBlank : false,
                        blankText : '资源名称不能为喔！',
                        beforeLabelTextTpl : ['<span style="color:red;">*</span>'],
                        maxLength : 256
                    }, {
                        xtype : 'textfield',
                        name : 'url',
                        fieldLabel : 'URL',
                        maxLength : 256
                    }, {
                        xtype : 'textfield',
                        name : 'uiid',
                        fieldLabel : 'UIID',
                        maxLength : 256
                    }, {
                        xtype : 'textfield',
                        name : 'description',
                        fieldLabel : '描述',
                        columnWidth : 1,
                        maxLength : 512
                    }, {
                        name : 'roles',
                        xtype : 'gridfield',
                        fieldLabel : '角色配置',
                        columnWidth : 1,
                        height : 300,
                        readOnly : false,
                        submitFields : ['id', 'name'],
                        addHandler : function()
                        {
                            var grid = this;
                            Ext.create('Extend.window.SelectionWindow', {
                                        height : 500,
                                        grid : 'App.authorization.role.view.RoleSelection',
                                        listeners : {
                                            selected : function(rs)
                                            {
                                                grid.loadRecords(rs, true);
                                            }
                                        }
                                    }).show();
                        },
                        columns : [{
                                    header : '角色名',
                                    dataIndex : 'name'
                                }, {
                                    header : '描述',
                                    dataIndex : 'rolename'
                                }, {
                                    header : '创建人',
                                    dataIndex : 'creator'
                                }, {
                                    xtype : 'cdtcolumn',
                                    header : '创建时间',
                                    dataIndex : 'cdt'
                                }]
                    }]
        })
