Ext.define("App.main.view.North", {
    extend: "Ext.container.Container",
    alias: "widget.North",
    layout: 'border',
    region: 'north',
    minWidth: 1280,
    style: {
        'background': '#157FCC;',
        "z-index": "999"
    },
    requires: ['App.main.controller.NorthController',
        'App.main.viewmodel.NorthModel'],
    controller: 'NorthController',
    viewModel: {
        type: 'NorthModel'
    },
    initComponent: function () {
        var me = this;
        var title = Ext.select('title');
        title.setHtml('RFMP_系统配置')
        var vm = this.getViewModel();
        // vm.bind('{user}', function(user) {
        // if (!Ext.isEmpty(val) && val.name.indexOf('登录') == -1
        // && val.name.indexOf('加载中') == -1) {
        //
        // console.log("test")
        // vm.set('user', val);
        // }
        //
        // });
        me.tools = me.createMenu(vm.data.menus, true);

        me.items = [{
            xtype: 'container',
            height: 60,
            width: 290,
            region: 'west',
            items: [{
                xtype: 'image',
                src: 'resources/images/logo.png',
                style: {
                    cursor: 'pointer'
                },
                listeners: {
                    afterrender: function () {
                        this.getEl().on({
                            click: function () {
                                window.location.href = window.context;
                            }
                        });
                    }
                }
            }]
        }, {
            xtype: 'container',
            region: 'center',
            margin: '3 0 0 0',
            defaultType: 'button',
            defaults: {
                height: 45
            },
            minWidth: 900,
            border: true,
            items: me.tools
        }, {
            xtype: 'container',
            height: 45,
            layout: 'vbox',
            region: 'east',
            defaultType: 'displayfield',
            padding: '5 0 0 0',
            defaults: {
                labelStyle: 'min-height:18px;padding:0;color:#FFF;white-space:nowrap;',
                fieldStyle: 'min-height:18px;padding:0;margin:0;color:#FFF;white-space:nowrap;',
                labelAlign: 'right',
                submitValue: false,
                labelWidth: 40
            },
            items: [{
                fieldLabel: '用户',
                name: 'user_name',
                bind: {
                    value: '{user.name}'
                }
            }]
        }]

        this.callParent();
    },
    createMenu: function (menudata, topmenu) {
        var me = this;
        var menus = [];
        if (Ext.isArray(menudata)) {
            Ext.Array.each(menudata, function (item, index, countriesItSelf) {
                var menu = {
                    text: item.name,
                    iconCls: item.iconCls,
                    menuExpandDelay: 10,
                    security: item.security,
                    uiid: item.uiid,
                    hidden: item.security == true
                };
                if (topmenu === true) {
                    menu.padding = '0 0 13 0';
                    menu.height = 45;
                    menu.width = 120;
                }

                if (!Ext.isEmpty(item.clazz)) {
                    menu.clazz = item.clazz;
                    menu.style = 'padding-top:5px;';
                    menu.handler = function () {
                        if (!Ext.isEmpty(item.clazz)) {
                            me.fireEvent('menuclick', item.clazz, {
                                id: item.clazz.replace(/\./g,
                                    "_"),
                                closable: item.closable === "false"
                                    ? false
                                    : true,
                                title: item.name
                            });
                        }
                    }
                }
                if (!Ext.isEmpty(item.menus)) {
                    var nm = me.createMenu(item.menus, false)
                    menu.menu = nm;
                }
                menus.push(menu);
            });

        }
        return menus;
    }

})