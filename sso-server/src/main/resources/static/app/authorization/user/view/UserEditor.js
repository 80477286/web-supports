Ext.define('App.authorization.user.view.UserEditor', {
    extend: 'Extend.window.FormWindow',
    alias: 'widget.UserEditor',
    config: {
        entity: 'user',
        window: {
            title: '用户信息编辑',
            width: 1024,
            height: 520
        }
    },
    items: [{
        xtype: 'hidden',
        name: 'id'
    }, {
        xtype: 'textfield',
        name: 'username',
        fieldLabel: '帐号',
        allowBlank: false,
        blankText: '帐号不能为喔！',
        beforeLabelTextTpl: ['<span style="color:red;">*</span>'],
        maxLength: 32
    }, {
        xtype: 'textfield',
        name: 'password',
        fieldLabel: '密码',
        allowBlank: false,
        blankText: '密码不能为喔！',
        beforeLabelTextTpl: ['<span style="color:red;">*</span>'],
        maxLength: 32,
        inputType: 'password'
    }, {
        xtype: 'textfield',
        name: 'name',
        fieldLabel: '姓名',
        maxLength: 32
    }, {
        xtype: 'textfield',
        name: 'email',
        fieldLabel: '邮箱',
        maxLength: 128
    }, {
        xtype: 'datefield',
        name: 'accountExpiringDate',
        format: 'Y-m-d',
        editable: false,
        fieldLabel: '帐号失效时间',
        allowBlank: false,
        blankText: '帐号失效时间字段不能为喔！',
        beforeLabelTextTpl: ['<span style="color:red;">*</span>']
    }, {
        xtype: 'datefield',
        format: 'Y-m-d',
        editable: false,
        name: 'credentialsExpiringDate',
        fieldLabel: '密码失效时间',
        allowBlank: false,
        blankText: '密码失效时间不能为喔！',
        beforeLabelTextTpl: ['<span style="color:red;">*</span>']
    }, {
        xtype: 'booleancombobox',
        name: 'locked',
        fieldLabel: '帐号锁定',
        allowBlank: false,
        blankText: '帐号锁定字段不能为喔！',
        beforeLabelTextTpl: ['<span style="color:red;">*</span>']
    }, {
        name: 'roles',
        xtype: 'gridfield',
        fieldLabel: '角色配置',
        columnWidth: 1,
        height: 300,
        readOnly: false,
        submitFields: ['id', 'name'],
        addHandler: function () {
            var grid = this;
            Ext.create('Extend.window.SelectionWindow', {
                height: 500,
                grid: 'App.authorization.role.view.RoleSelection',
                listeners: {
                    selected: function (rs) {
                        grid.loadRecords(rs, true);
                    }
                }
            }).show();
        },
        columns: [{
            header: '角色名',
            dataIndex: 'name'
        }, {
            header: '描述',
            dataIndex: 'rolename'
        }, {
            header: '创建人',
            dataIndex: 'creator'
        }, {
            xtype: 'cdtcolumn',
            header: '创建时间',
            dataIndex: 'cdt'
        }]
    }]
})
