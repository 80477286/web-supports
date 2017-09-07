Ext.define('Extend.plugins.search.GridPanelAdvancedSearch', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.GridPanelAdvancedSearch',
    // ----自定义配置项开始----
    buttonText: '高级查询',
    windowTitle: '高级查询',
    searchText: '查询',
    resetText: '重置',
    cancelText: '返回',
    simpleSearch: true,
    advancedSearch: true,
    searchFieldWidth: 240,
    searchValueWidth: 240,
    mode: 'remote',
    fields: [],
    baseParams: {},
    // ----自定义配置项结束 ----

    gridPane: null,
    toolBar: null,
    searchWindow: null,
    constructor: function (config) {
        if (this.mode == 'local') {
            this.advancedSearch = false;
            this.simpleSearch = true
        }
        this.callParent(arguments);
    },
    init: function (gridPanel) {
        var me = this;
        me.gridPanel = gridPanel;
        me.gridPanel.baseParams = me.baseParams;
        var toolbars = gridPanel.getDockedItems('toolbar[dock="top"]');
        if (toolbars.length > 0) {
            me.toolBar = toolbars[0];
        } else {
            me.toolBar = Ext.create("Ext.toolbar.Toolbar", {
                dock: 'top'
            });
            gridPanel.addDocked(me.toolBar);
        }

        if (me.toolBar) {
            var index = -1;
            for (var i = 0; i < me.toolBar.items.getCount(); i++) {
                var item = me.toolBar.items.getAt(i);
                if (item.xtype == "tbfill") {
                    index = i;
                    break;
                }
            }
            if (index == -1) {
                me.toolBar.insert(0, Ext.create("Ext.toolbar.Fill"));
            }
            if (index == -1) {
                index = 0;
            }
            if (me.simpleSearch) {
                index = me.initSimpleSearchCmps(index);
            }
            if (me.advancedSearch) {
                me.btnAdvancedSearch = Ext.create('Ext.button.Button', {
                    text: me.buttonText,
                    iconCls: 'advanced_search',
                    scope: me,
                    handler: me.onShowSearchWindow
                });
                me.toolBar.insert(index >= 4 ? index : ++index, me.btnAdvancedSearch);
            }
        }

    },
    onShowSearchWindow: function () {
        var me = this;
        if (!this.searchWindow) {
            me.searchWindow = me.createSearchWindow();
        }
        if (this.searchWindow && !this.searchWindow.isVisible()) {
            this.searchWindow.show();
            this.searchWindow.anchorTo(this.btnAdvancedSearch, 'tr-br')
        } else if (this.searchWindow.isVisible()) {
            this.searchWindow.hide();
        }
    },
    createSearchWindow: function () {
        var me = this;
        var win = Ext.create("Extend.plugins.search.SearchWindow", {
            fields: me.fields,
            searchText: me.searchText,
            cancelText: me.cancelText,
            title: me.windowTitle,
            listeners: {
                'searching': function (params) {
                    try {
                        me.btnAdvancedSearch.disable();
                        me.searchBtn.disable();
                        var store = me.gridPanel.getStore();
                        if (Ext.isObject(me.gridPanel.baseParams)) {
                            Ext.apply(params, me.gridPanel.baseParams);
                        }
                        store.getProxy().setExtraParams(params);
                        store.load({
                            page: 1,
                            callback: function () {
                                me.searchBtn.enable();
                                me.btnAdvancedSearch.enable();
                            }
                        });
                        me.simSearchField.reset();
                        me.simSearchValue.reset();
                    } catch (e) {

                        me.searchBtn.enable();
                        me.btnAdvancedSearch.enable();
                        throw e;
                    }
                }
            }
        });
        return win;
    },
    initSimpleSearchCmps: function (index) {
        var me = this;
        me.simSearchField = Ext.create("Ext.form.field.ComboBox", {
            fieldLabel: '字段',
            submitValue: false,
            store: Ext.create('Ext.data.Store', {
                fields: ['field', 'name', {
                    name: 'defaultValue'
                }, {
                    name: 'datas'
                }, {
                    name: 'vtype',
                    defaultValue: 's'
                }, {
                    name: 'opt',
                    defaultValue: '='
                }, {
                    name: 'queryName',
                    convert: function (v, r) {
                        var opt = me.optMap[r.get("opt")];
                        var field = r.get("field");
                        return field + "_" + opt
                    }
                }],
                data: me.fields
            }),
            queryMode: 'local',
            displayField: 'name',
            valueField: 'queryName',
            width: me.searchFieldWidth,
            labelWidth: 40,
            labelAlign: "right",
            editable: false,
            listeners: {
                change: function (t, n, o, datas) {
                    if (!Ext.isEmpty(n)) {
                        me.searchBtn.enable();
                    } else {
                        me.searchBtn.disable();
                        me.simSearchValue.setValue('');
                    }
                    var store = this.getStore();
                    var field = null;
                    for (var i = 0; i < store.getCount(); i++) {
                        var r = store.getAt(i);
                        var opt = me.optMap[r.get("opt")];
                        var field = r.get("field");
                        if ((field + "_" + opt) == n) {
                            field = r.data;
                            break;
                        }

                    }
                    if (field) {
                        var cmp = me.toolBar.items.getAt(me.searchValueInput);
                        me.simSearchValue = me.createSearchValueInput(r.data);
                        me.toolBar.remove(cmp);
                        me.toolBar.insert(index + 2, me.simSearchValue);
                    }
                }
            }
        })
        me.toolBar.insert(index + 1, me.simSearchField);

        me.simSearchValue = Ext.create("Ext.form.field.Text", {
            fieldLabel: '值',
            submitValue: false,
            labelWidth: 20,
            width: me.searchValueWidth,
            labelAlign: "right",
            xtype: 'textfield',
            disabled: true
        })
        me.searchValueInput = index + 2;
        me.toolBar.insert(index + 2, me.simSearchValue);

        me.searchBtn = Ext.create("Ext.button.Button", {
            text: me.searchText,
            iconCls: 'search',
            disabled: true,
            handler: function () {
                if (me.mode == 'remote') {
                    me.remoteSearch();
                } else {
                    me.localSearch();
                }
            }
        })
        me.toolBar.insert(index + 3, me.searchBtn);
        var resetBtn = Ext.create("Ext.button.Button", {
            text: me.resetText,
            iconCls: 'reset',
            handler: function () {
                me.simSearchValue.reset();
                me.simSearchField.reset();
                me.simSearchValue.disable();
                if (me.mode == 'remote') {
                    if (me.searchWindow) {
                        me.searchWindow.reset();
                    }
                    var store = me.gridPanel.getStore();
                    if (!Ext.isEmpty(me.gridPanel.baseParams) && Ext.isObject(me.gridPanel.baseParams)) {
                        store.getProxy().setExtraParams(Ext.clone(me.gridPanel.baseParams));
                        store.load({
                            page: 1
                        });
                    } else {
                        store.load({
                            page: 1
                        });
                    }
                } else {
                    me.gridPanel.getStore().clearFilter(true);
                    me.gridPanel.getStore().filter([{
                        filterFn: function (r) {
                            return true;
                        }
                    }]);
                }

            }
        })
        me.toolBar.insert(index + 4, resetBtn);
        return index + 4;
    },
    optMap: {
        '>': "gt",
        '>=': "ge",
        '<': "lt",
        '<=': "le",
        '=': "eq",
        '!=': "ne",
        'like': "like",
        'is null': "null",
        'is not null': "notnull"
    },
    createSearchValueInput: function (field) {
        var me = this;
        var vtype = field.vtype;
        var editor = null;
        if (vtype == 'bl' || (field.datas && field.datas.length > 0)) {
            // 创建下拉框
            var xtype = 'Ext.form.ComboBox';
            if (field.checked == true) {
                xtype = 'Extend.form.field.CheckCombo'
            }
            editor = Ext.create(xtype, {
                store: Ext.create('Ext.data.ArrayStore', {
                    fields: ['name', "value"],
                    data: field.datas ? field.datas : [["True", "true"], ["False", "False"]]
                }),
                emptyText: '查询值',
                queryMode: 'local',
                displayField: 'name',
                valueField: 'value',
                editable: false,
                fieldLabel: '值',
                labelWidth: 20,
                width: me.searchValueWidth
            });
        } else if (vtype == 'i' || vtype == 'f' || vtype == 'd' || vtype == 'b' || vtype == 'l') {
            // 创建数字输入框
            editor = Ext.create("Ext.form.NumberField", {
                emptyText: '查询值',
                width: me.searchValueWidth,
                fieldLabel: '值',
                labelWidth: 20
            });
        } else if (vtype == "s" || vtype == "tx") {
            editor = Ext.create("Ext.form.TextField", {
                emptyText: '查询值',
                fieldLabel: '值',
                width: me.searchValueWidth,
                labelWidth: 20
            });
        } else if (vtype == 'dt') {
            editor = Ext.create('Ext.form.field.Date', {
                format: 'Y-m-d',
                emptyText: '查询值',
                fieldLabel: '值',
                width: me.searchValueWidth,
                labelWidth: 20,
                editable: false
            });
        }
        if (editor) {
            if (field.defaultValue) {
                editor.setValue(field.defaultValue);
            }
        }
        return editor;
    },
    remoteSearch: function () {
        var me = this;
        try {
            if (me.btnAdvancedSearch) {
                me.btnAdvancedSearch.disable();
            }
            me.searchBtn.disable();
            var value = me.simSearchValue.getValue();
            if (Ext.isEmpty(value)) {
                if (me.btnAdvancedSearch) {
                    me.btnAdvancedSearch.enable();
                }
                me.searchBtn.enable();
                return;
            }
            var panel = me.gridPanel;
            var params = {};
            var fieldname = me.simSearchField.getValue();
            if (fieldname) {
                if (Ext.isString(value)) {
                    value = Ext.String.trim(value);
                }
                params["params." + fieldname] = value
            }
            var store = panel.getStore();
            if (Ext.isObject(me.gridPanel.baseParams)) {
                Ext.apply(params, me.gridPanel.baseParams);
            }
            store.getProxy().setExtraParams(params);
            store.load({
                page: 1,
                callback: function () {
                    if (me.btnAdvancedSearch) {
                        me.btnAdvancedSearch.enable();
                    }
                    me.searchBtn.enable();
                }
            });
            if (me.searchWindow) {
                me.searchWindow.reset();
            }
        } catch (e) {
            if (me.btnAdvancedSearch) {
                me.btnAdvancedSearch.enable();
            }
            me.searchBtn.enable();
            throw e;
        }
    },
    localSearch: function () {
        var me = this;
        var panel = me.gridPanel;
        panel.getStore().clearFilter(true);
        var value = me.simSearchValue.getValue();

        var fieldname = me.simSearchField.getValue();
        if (fieldname) {
            if (Ext.isString(value)) {
                value = Ext.String.trim(value);
            }
        }
        var searchOpts = {
            filterFn: function (record) {
                if (Ext.isEmpty(value)) {
                    return true;
                }
                var sr = me.simSearchField.getStore().findRecord("queryName", fieldname);

                var svalue = record.get(sr.get("field"))

                if (sr.get('vtype') == 's') {
                    var regex = new RegExp('([\s]*)' + value + '([\s]*)')
                    var result = regex.test(svalue);
                    return result;
                } else {
                    return svalue == value;
                }
            }
        }
        panel.getStore().filter([searchOpts]);
    }
});
