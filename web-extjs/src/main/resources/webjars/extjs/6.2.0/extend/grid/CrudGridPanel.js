Ext.define('Extend.grid.CrudGridPanel', {
    extend: 'Extend.grid.LazyLoadGridPanel',
    alias: 'widget.CrudGridPanel',
    config: {
        api: {},
        coerciveDeleteConfirm: false,
        editor: {},
        tbar: {
            add: {
                before: '-',
                text: '添加',
                index: 1,
                iconCls: 'add',
                handler: function () {
                    var me = this.up('CrudGridPanel');
                    me.addHandler.call(me);
                }
            },
            quickCreate: {
                index: 2,
                text: '快速创建',
                iconCls: 'quickAdd',
                xtype: 'button',
                disabled: true,
                handler: function () {
                    var me = this.up('CrudGridPanel');
                    var records = me.getSelectedRecords();
                    if (records.length == 1) {
                        me.editHandler.call(me, records[0], true);
                    }
                }
            },

            edit: {
                text: '编辑',
                index: 3,
                iconCls: 'edit',
                disabled: true,
                handler: function () {
                    var me = this.up('CrudGridPanel');
                    var records = me.getSelectedRecords();
                    if (records.length == 1) {
                        me.editHandler.call(me, records[0]);
                    }
                }
            },
            remove: {
                text: '删除',
                index: 4,
                iconCls: 'delete',
                disabled: true,
                handler: function () {
                    var me = this.up('CrudGridPanel');
                    var ids = me.getSelectedIds();
                    if (ids.length > 0) {
                        me.deleteHandler.call(me, ids, null);
                    }
                }
            }
        }
    },
    initEvents: function () {
        this.on({
            itemdblclick: function ($this, record, item, index,
                                    e, eOpts) {
                this.editHandler(record);
            },
            selectionchange: function ($this, selected, eOpts) {
                this.resetButtons(selected)
            }
        });
        this.callParent(arguments);
    },
    resetButtons: function (selected) {
        var btnEdit = this
            .down('button[action="edit"]');
        var btnRemove = this
            .down('button[action="remove"]');
        var btnQuickCreate = this
            .down('button[action="quickCreate"]');
        if (selected.length > 0) {
            if (selected.length == 1) {
                if (btnEdit) {
                    btnEdit.enable();
                }
                if (btnQuickCreate) {
                    btnQuickCreate.enable();
                }
            } else {
                if (btnEdit) {
                    btnEdit.disable();
                }
                if (btnQuickCreate) {
                    btnQuickCreate.disable();
                }
            }
            if (btnRemove) {
                btnRemove.enable();
            }
        } else {
            if (btnRemove) {
                btnRemove.disable();
            }
            if (btnEdit) {
                btnEdit.disable();
            }
            if (btnQuickCreate) {
                btnQuickCreate.disable();
            }
        }
    },
    deleteHandler: function (ids, messages) {
        var me = this;
        Extend.Msg.confirm('确认', '请确定您是否要删除选择的数据，删除后将不可恢复？', messages,
            function (opt) {
                if (opt === 'yes') {
                    me.mask('删除...')
                    var params = {
                        ids: ids
                    };

                    if (this.coerciveDeleteCheckbox.getValue()) {
                        params.coercive = true;
                    }
                    Ext.Ajax.request({
                        url: me.api.del || me.api.remove
                        || me.api.destory
                        || me.editor.del
                        || me.editor.remove
                        || me.editor.destory,
                        params: params,
                        success: function (resp) {
                            try {
                                if (resp.result.success) {
                                    me.deselectAll();
                                    me.reload();
                                }
                            } finally {
                                me.unmask();
                            }
                        },
                        failure: function () {
                            me.unmask();
                        }
                    });
                }
            }, me.coerciveDeleteConfirm)

    },
    editHandler: function (record, quickCreate, data) {
        var me = this;
        if (me.editor) {
            var opts = Ext.apply({
                targetGrid: me,
                url: me.editor.save || me.editor.submit,
                window: {},
                model: me.editor.model || 'Ext.data.Model',
                quickCreate: quickCreate
            }, me.editor)
            if (!Ext.isEmpty(me.editor.width)) {
                opts.window.width = me.editor.width
            }
            if (!Ext.isEmpty(me.editor.height)) {
                opts.window.height = me.editor.height
            }
            if (!Ext.isEmpty(me.editor.title)) {
                opts.window.title = me.editor.title
                if (quickCreate == true) {
                    opts.window.title = opts.window.title + '_快速创建'
                }
            }
            var editor = Ext.create(
                me.editor.formClass || me.editor.formClazz, opts)
                .show();
            var model = editor.model;
            if (!Ext.isEmpty(record)) {
                if (Ext.isEmpty(me.editor.get)
                    && Ext.isEmpty(me.editor.read)) {
                    if (quickCreate == true) {
                        record.set('id', null);
                    }
                    editor.loadRecord(record);
                } else {
                    var url = me.editor.get || me.editor.read;
                    if (quickCreate == true) {
                        url = me.editor.copy || url
                    }
                    editor.load({
                        url: url,
                        params: {
                            id: record.get('id')
                        }
                    });
                }
            } else {
                if (!Ext.isEmpty(model)) {
                    record = Ext.create(model, data);
                    record.set('id', null);
                    editor.loadRecord(record);
                }
            }
        }
    },
    addHandler: function () {
        this.editHandler();
    },
    setEditor: function () {
        this.callParent(arguments);
    }
});