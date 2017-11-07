Ext.define("Extend.form.Panel", {
    extend: 'Ext.form.Panel',
    alias: 'widget.Panel',
    requires: ['Extend.form.Basic'],
    region: 'center',
    scrollable: true,
    layout: 'column',
    config: {
        isEdit: true,
        unmaskable: true,
        loadMaskText: '加载...',
        saveMaskText: '保存...',
        model: 'Ext.data.Model',
        rootProperty: 'data',
        resetBySave: true,
        recordable: false,// 是否支持修改记录
        targetGrid: null,
        submitEmptyText: false,
        defaults: {
            margin: 5,
            columnWidth: .5,
            labelAlign: 'right',
            labelWidth: 100
        }
    },
    createForm: function () {
        var cfg = {}, props = this.basicFormConfigs, len = props.length, i = 0, prop;
        for (; i < len; ++i) {
            prop = props[i];
            cfg[prop] = this[prop];
        }
        cfg["entity"] = this['entity'];
        return new Extend.form.Basic(this, cfg);
    },
    initComponent: function () {
        var me = this;
        this.on({
            actionfailed: function (formbase, action, eOpts) {
                this.unmask();
                Extend.Msg
                    .error(
                        '错误',
                        action.result.result
                        || ('操作发生错误:' + (this.action === 'save'
                        ? action.form.url
                        : (action.form.get
                            || action.form.load || action.form.read))),
                        action.result.messages, action.result.errors,
                        action.result.exception)
                this.fireEvent(this.action === 'load'
                    ? 'loadfailure'
                    : 'savefailure', formbase, action)
            },
            actioncomplete: function (formbase, action, eOpts) {
                if (this.unmaskable === true) {
                    this.unmask();
                }
                if (this.action === 'load') {
                    var record = Ext.create(me.model
                        || 'Extend.data.IdentityModel',
                        action.result[this.rootProperty]);
                    this.loadRecord(record);
                    this.fireEvent('load', formbase, action, eOpts)
                } else {
                    if (!Ext.isEmpty(this.targetGrid)) {
                        if (Ext.isFunction(this.targetGrid.deselectAll)) {
                            this.targetGrid.deselectAll();
                        }
                        if (Ext.isFunction(this.targetGrid.reload)) {
                            this.targetGrid.reload();
                        }
                    }
                    this.fireEvent('save', formbase, action)
                    if (this.resetBySave) {
                        this.reset();
                    }
                }
            },
            beforeaction: function (formbase, action, eOpts) {
                if (this.action === 'load') {
                    this.mask(this.loadMaskText);
                } else {
                    this.mask(this.saveMaskText);
                }
            }
        });
        this.callParent(arguments);
    },
    getParams: Ext.emptyFn,
    load: function (opts) {
        this.action = 'load';
        if (Ext.isEmpty(opts.url)) {
            opts.url = this.read || this.load || this.api.read || this.api.load;
        }
        if (Ext.isEmpty(opts.url)) {
            Extend.Msg.error('错误', '无法加载需要编辑的数据，未配置URL地址！')
            return;
        }
        this.callParent(arguments);
    },
    loadRecord: function (record) {
        if (Ext.isEmpty(record)) {
            Extend.Msg.error('错误', '无法加载需要编辑的数据，目标数据为空！')
            return;
        }
        if (this.quickCreate === true) {
            record.set('id', null);
        }
        this.callParent(arguments);
    },
    getDatas: function (asString, dirtyOnly, includeEmptyText, useDataValues,
                        isSubmitting) {
        return this.getForm().getDatas();
    },
    save: function () {
        var me = this;
        var grids = this.query('grid');
        if (Ext.isEmpty(roweditor)) {
            for (var i = 0; i < grids.length; i++) {
                var grid = grids[i];
                var roweditor = grid.findPlugin('rowediting');
                if (!Ext.isEmpty(roweditor) && roweditor.editing === true) {
                    Extend.Msg.error('错误', '表单“' + grid.getTitle()
                        + '”正处于编辑状态，请结束编辑后重试！')
                    return;
                }
            }
        }
        if (me.isValid()) {
            me.action = 'save';
            var params = {
                submitEmptyText: me.submitEmptyText,
                params: me.getParams()
            }
            me.submit(params);
        }
    }
});