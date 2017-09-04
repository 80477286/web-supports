Ext.define('App.components.tab.BaseCenter', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.BaseCenter',
    region: 'center',
    statusId: '_rfmp_tab_status_',
    requires: ['Extend.plugins.TabCloseMenu'],
    plugins: [{
        ptype: 'tabclosemenu',
        closeTabText: '关闭',
        closeAllTabsText: '关闭所有',
        closeOthersTabsText: '关闭其它'
    }],
    listeners: {
        "tabcreate": function (tab, iframe, opts) {
            var status = Ext.state.Manager.get(this.statusId, {
                map: {}
            });
            if (!status.map[opts.id]) {
                status.map[opts.id] = opts;
                Ext.state.Manager.set(this.statusId, status);
            }
        },
        tabchange: function (tabPanel, newCard, oldCard, eOpts) {
            var status = Ext.state.Manager.get(this.statusId, {
                map: {}
            });
            status[this.statusId + "_activeTab"] = newCard.id;
            Ext.state.Manager.set(this.statusId, status);
        },
        remove: function (target, cmp, opts) {
            var status = Ext.state.Manager.get(this.statusId, {
                map: {}
            });
            delete status.map[cmp.id];
            Ext.state.Manager.set(this.statusId, status);
        },
        afterrender: function () {
            var me = this;
            var status = Ext.state.Manager.get(this.statusId, {
                map: {}
            });

            if (status.map) {
                for (var key in status.map) {
                    var options = status.map[key];
                    try {
                        me.createComponent(options.clazz, options);
                    } catch (e) {
                        Ext.log({
                            level: 'error',
                            msg: '创建Tab出现异常：' + options.clazz,
                            dump: e
                        });
                        delete status.map[key];
                    }
                }
                if (!Ext.isEmpty(status[this.statusId + "_activeTab"])) {
                    me
                        .setActiveTab(status[this.statusId
                        + "_activeTab"]);
                }
            }
            Ext.state.Manager.set(this.statusId, status);
        }
    },
    createComponent: function (clazz, options, actived) {
        var me = this;
        options.listeners = {
            afterrender: function () {
                app.checkAuthorities.call(app, this)
            }
        }
        var um = null;
        if (me.queryById(options.id)) {
            me.setActiveItem(options.id);
        } else {
            if (!Ext.isEmpty(clazz)) {
                options.clazz = clazz;
                um = Ext.create(clazz, options);
                me.add(um);
                if (actived == true) {
                    me.setActiveItem(um);
                }
                me.fireEvent('tabcreate', me, um, options)
            } else {
                Extend.Msg.error('错误', '访问出现错误，菜单项未指定资源。');
            }
        }
        return um;
    }
})