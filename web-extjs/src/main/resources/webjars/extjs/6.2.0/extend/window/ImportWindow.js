Ext.define("Extend.window.ImportWindow", {
    extend: 'Extend.window.ExtendWindow',
    title: "导入",
    height: 240,
    width: 500,
    resizable: false,
    closable: false,
    modal: true,
    subscribes: [],
    url: '',
    config: {
        message: '<span style = \"color: red\">覆盖式导入，请谨慎操作！<br/></span>请选择需要导入的数据文件，点击确定开始导入。'
    },
    initComponent: function () {
        var me = this;
        me.buttons = ['->', {
            xtype: 'button',
            text: '确定',
            action: 'ok',
            disabled: true,
            handler: function () {
                var btnOk = this;
                btnOk.disable();
                me.down("button[action='close']").disable();
                var form = me.formPanel.getForm();
                var opts = {
                    url: me.url,
                    submitEmptyText: false,
                    success: function (form, action) {
                        btnOk.enable();
                        me.down("button[action='close']").enable();
                        me.successHandler.call(btnOk, form, action);
                        me.fireEvent('imported', form, action);
                    },
                    failure: function () {
                        btnOk.enable();
                        me.down("button[action='close']").enable();
                    }
                };
                if (me.progressBar) {
                    me.progressBar.reset();
                }
                form.submit(opts);
            }
        }, {
            xtype: 'button',
            action: 'close',
            text: '关闭',
            handler: function () {
                me.close();
            }
        }];
        me.callParent(arguments);
        me.formPanel = Ext.create('Ext.form.Panel', {
            region: 'center',
            layout: 'column',
            timeout: 10 * 60 * 1000,
            defaults: {
                labelAlign: 'right',
                columnWidth: 1,
                margin: 5
            },
            bodyStyle: 'padding:10px;',
            items: [{
                xtype: 'panel',
                margin: 2,
                bodyStyle: 'border:1px solid #666;color:#666;padding:5px;line-height:20px;',
                html: me.message
            }, {
                xtype: 'filefield',
                fieldLabel: '数据文件',
                allowBlank: false,
                margin: '15 5 5 5',
                allowBlankText: '必须选择数据文件!',
                name: 'file',
                accept: me.accept,
                listeners: {
                    change: function ($this, value, eOpts) {
                        if (!Ext.isEmpty(value)) {
                            me.down('button[action="ok"]').enable();
                        } else {
                            me.down('button[action="ok"]').disable();
                        }
                    }
                }
            }]
        });
        me.add(me.formPanel);
        me.on({
            afterlayout: function () {
                var me = this;
                if (!Ext.isEmpty(me.subscribes)) {

                    me.progressBar = Ext.create('Ext.ProgressBar', {
                        renderTo: me.getEl(),
                        margin: '0 10 0 10',
                        style: 'border:1px solid #000;'
                    });
                    me.progressBar.updateProgress(0);
                    Ext.Array.each(me.subscribes, function (item) {
                        app.message.subscribe(item, function (content) {
                            me.progressHandler.call(me, content)
                        });
                    })
                }
            },
            close: function () {
                if (!Ext.isEmpty(me.subscribes)) {
                    Ext.Array.each(me.subscribes, function (item) {
                        app.message.unsubscribe(item);
                    })
                }
            }
        });
    },
    progressHandler: function (content) {
        var total = content.total, current = content.current, percent;
        percent = Math.abs(current) / Math.abs(total);
        if (percent > 1) {
            percent = 1;
        }
        this.progressBar.updateProgress(percent, content.data || Ext.util.Format.round(percent * 100, 2) + "%");
    },
    successHandler: function (form, action) {
        Extend.Msg.info("提示", action.result.result, action.result.messages);
    }
});
