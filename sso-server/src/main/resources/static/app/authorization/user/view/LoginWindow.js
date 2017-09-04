Ext.define('App.authorization.user.view.LoginWindow', {
    extend : 'Ext.window.Window',
    alias : 'widget.login_window',
    requires : ['App.authorization.user.LoginWindowController'],
    controller : 'login_window_controller',
    // ---------------------新增配置------------------------
    usernameText : '用户帐号',
    passwordText : '登录密码',
    loginText : '登录',
    cancelText : '取消',
    remembermeText : '记住我',
    submitText : '验证...',
    usernameBlankText : '用户帐号不能为空，请重新输入.',
    passwordBlankText : '登录密码不能为空，请重新输入.',
    usernameEmptyText : '请输入您的China域帐号.',
    passwordEmptyText : '请输入您的China域密码.',
    // -----------------------------------------------------
    width : 600,
    height : 330,
    constrain : true,
    redirect : null,
    title : '登录窗口',
    layout : 'border',
    resizable : false,
    modal : true,
    iconCls : 'key',
    initComponent : function()
    {
        var me = this;
        me.buttons = me.createTooltar();
        me.formPanel = me.createFormPanel();
        me.items = [me.formPanel];
        this.callParent();
    },
    createTooltar : function()
    {
        var me = this;
        var buttons = [{
                    xtype : 'button',
                    text : me.loginText,
                    height : 30,
                    iconCls : 'lock_open',
                    action : 'login'
                }, {
                    xtype : 'button',
                    text : me.cancelText,
                    height : 30,
                    action : 'cancel',
                    iconCls : 'cancel'
                }];
        return buttons;
    },
    createFormPanel : function()
    {
        var me = this;
        var form = Ext.create('Ext.form.Panel', {
                    url : 'login',
                    region : 'center',
                    layout : 'column',
                    defaultType : 'textfield',
                    defaults : {
                        labelWidth : 100,
                        labelAlign : 'right',
                        columnWidth : .9,
                        fieldStyle : 'font-size:13px;'
                    },
                    items : [{
                                xtype : 'hidden',
                                name : 'sumit',
                                value : 'Login'
                            }, {
                                xtype : 'label',
                                text : '提示：请使用您的China域帐号和密码进行登录验证；如果您是第一次登录，登录后请找管理员对您的当前帐号进行授权(授权后需要重新登录)，以便您能够访问相关资源。',
                                style : {
                                    color : '#666'
                                },
                                margin : '20 5 5 48'
                            }, {
                                fieldLabel : me.usernameText,
                                name : 'username',
                                enableKeyEvents : true,
                                margin : '25 5 15 5',
                                height : 30,
                                emptyText : me.usernameEmptyText,
                                allowBlank : false,
                                blankText : me.usernameBlankText,
                                labelStyle : 'padding-top:3px;font-size:13px;',
                                itemId : 'username'
                            }, {
                                xtype : 'label',
                                text : '*',
                                style : {
                                    color : 'red'
                                },
                                margin : '40 5 15 5',
                                columnWidth : .1
                            }, {
                                fieldLabel : me.passwordText,
                                name : 'password',
                                height : 30,
                                inputType : 'password',
                                margin : '15 5 15 5',
                                emptyText : me.passwordEmptyText,
                                allowBlank : false,
                                blankText : me.passwordBlankText,
                                enableKeyEvents : true,
                                labelStyle : 'padding-top:3px;font-size:13px;'
                            }, {
                                xtype : 'label',
                                text : '*',
                                style : {
                                    color : 'red'
                                },
                                margin : '20 5 15 5',
                                columnWidth : .1
                            }, {
                                xtype : 'checkbox',
                                fieldLabel : me.remembermeText,
                                name : 'remember-me',
                                hidden : true,
                                margin : '15 5 0 5',
                                labelStyle : 'font-size:13px;'
                            }, {
                                xtype : 'label',
                                margin : '10 0 0 105px',
                                name : 'errors',
                                style : 'color:red;font-size:12px;'
                            }]
                });
        return form;
    }
})