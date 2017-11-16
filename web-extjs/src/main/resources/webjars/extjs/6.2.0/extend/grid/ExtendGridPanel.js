/**
 * 基于Ext源表格扩展出的数据表格，继承至Ext.grid.Panel
 *
 * <pre>
 * 增加属性：
 *             enableCheckbox=true,
 *             // 记录选择模式: &quot;SINGLE&quot;/&quot;SIMPLE&quot;/&quot;MULTI&quot;
 *             selectionMode='MULTI'
 * 增加函数:
 *     Model[] getRecords():返回表中所有数据
 *     Model[] getSelectedRecords():返回所有选择的数据
 *     String[] getSelectedIds():返回所有选择的数据的ID
 *     reload():Store.reload()
 *     load():load()
 *     loadData():loadData()
 *     loadRecords():loadRecords()
 *     deselectAll：取消所有选取
 * </pre>
 */
Ext.define('Extend.grid.ExtendGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.ExtendGridPanel',
    mixins: ['Extend.toolbar.ToolbarsInit'],
    autoLoad: true,
    stateful: true,
    forceFit: true,
    reserveScrollbar: true,// 预留滚动条位置
    disableSelection: false,
    loadMask: true,
    minHeight: 95,
    sortableColumns: true,
    enableColumnMove: false,
    rowLines: true,
    border: true,
    config: {
        extraParams: null,
        pageable: true,
        model: 'Extend.data.IdentityModel',
        selModel: {
            selType: 'checkboxmodel',
            // Valid values are "SINGLE", "SIMPLE", and "MULTI".
            mode: 'MULTI',
            pruneRemoved: false
        },
        paging: {
            xtype: 'pagingtoolbar',
            displayInfo: true,
            dock: 'bottom',
            style: {
                'padding': '2px 0px 2px 8px'
            }
        },
        search: {
            simpleSearch: true,
            advancedSearch: true,
            mode: 'remote'
        },
        tbar: {}
    },
    viewConfig: {
        loadingText: "加载中...",
        enableTextSelection: true
    },
    initComponent: function () {
        this.initSearch();
        this.toolbarsInit(['tbar', 'bbar', 'lbar', 'fbar', 'rbar']);
        this.callParent(arguments);
        this.initPaging();
    },

    initSearch: function () {
        var me = this;
        if (me.searchable == false) {
            return
        }
        if (!Ext.isEmpty(me.search) && Ext.isObject(me.search)
            && Ext.isArray(me.search.fields)) {
            if (!me.plugins) {
                me.plugins = [];
            }
            var searchTool = this.findPlugin('GridPanelAdvancedSearch');
            if (Ext.isEmpty(searchTool)) {
                searchTool = Ext
                    .create(
                        "Extend.plugins.search.GridPanelAdvancedSearch",
                        me.search);
                searchTool.ptype = 'GridPanelAdvancedSearch';
                me.plugins.push(searchTool)
            }
        }
    },
    setSearch: function (search) {
        this.search = Ext.Object.merge(this.search || {}, search);
        this.initSearch();
        var searchTool = this.findPlugin('GridPanelAdvancedSearch');

        if (!Ext.isEmpty(searchTool)) {
            this.initPlugin(searchTool);
        }
    },
    initPaging: function () {
        if (this.pageable === true) {
            this.paging.store = this.store;
            this.paging = Ext.create('Ext.toolbar.Paging', this.paging)
            this.addDocked(this.paging);
        }
    },
    // 获取表格所有记录
    getRecords: function () {
        var me = this;
        var records = [];
        var store = this.getStore().each(function (record) {
            records.push(record);
        });
        return records;
    },
    // 获取表格所有Data
    getDatas: function () {
        var me = this;

        var datas = [];
        var records = me.getRecords();
        Ext.Array.each(records, function (item) {
            datas.push(item.data);
        })
        return datas;
    },
    deselectAll: function () {
        var sm = this.getSelectionModel();
        sm.deselectAll();
    },
    getSelectedRecords: function () {
        var me = this;
        return me.getSelectionModel().getSelection();
    },
    getAllIds: function () {
        var me = this;
        var ids = [];
        me.getStore().each(function (record) {
            ids.push(record.getId());
        });
        return ids;
    },
    getSelectedIds: function () {

        var me = this;
        var ids = [];
        var selection = me.getSelectionModel().getSelection();
        Ext.Array.each(selection, function (record) {
            ids.push(record.getId());
        });
        return ids;
    },
    reload: function (params) {
        this.getStore().reload(params);
    },
    loadDatas: function (data, append) {
        if (!Ext.isEmpty(data)) {
            if (!Ext.isArray(data)) {
                data = [data];
            }
            var rs = [];
            for (var i = 0; i < data.length; i++) {
                if (!(data[i] instanceof Ext.data.Model)) {
                    rs.push(Ext.create(this.model
                        || 'Extend.data.IdentityModel',
                        data[i]));
                }
            }
            this.loadRecords(rs, append);
        }
    },
    loadData: function (data, append) {
        if (!Ext.isEmpty(data)) {
            if (!Ext.isArray(data)) {
                data = [data];
            }
            this.loadDatas(data, append);
        }
    },
    loadRecords: function (records, append) {
        if (!Ext.isEmpty(records)) {
            var opt = append
            if (!Ext.isObject(append)) {
                opt = {
                    addRecords: append
                };
            } else {
                if (Ext.isDefined(opt.addRecord)
                    && !Ext.isDefined(opt.addRecords)) {
                    opt.addRecords = opt.addRecord;
                }
            }
            this.getStore().loadRecords(records, opt);
        }
    },
    insertRecord: function (index, record) {
        this.insertRecords(index, record);
    },
    insertRecords: function (index, records) {
        if (!Ext.isEmpty(records)) {
            this.getStore().insert(index, records);
        }
    },
    addRecord: function (index, record) {
        this.insertRecords(record);
    },
    addRecords: function (records) {
        if (!Ext.isEmpty(records)) {
            this.getStore().add(records);
        }
    },
    select: function (records, keepExisting, suppressEvent) {
        this.getSelectionModel().select(records, keepExisting,
            suppressEvent);
    },
    selectAll: function (suppressEvent) {
        this.getSelectionModel().selectAll(suppressEvent);
    },
    getFirst: function () {
        return this.getStore().first();
    },
    getLast: function () {
        return this.getStore().last();
    },
    setStore: function (store) {
        store.setAutoLoad(false);
        var me = this;
        store.on({
            'beforeload': function (store, operation, eOpts) {
                //修改默认分布参数名称
                operation._proxy.setStartParam("pageable.start")
                operation._proxy.setLimitParam('pageable.size')
                operation._proxy.setPageParam('pageable.page')
                operation._proxy.setSortParam('pageable.sort')
                var eps = {};
                if (!Ext.isEmpty(me.extraParams)) {
                    if (Ext.isFunction(me.extraParams)) {
                        var params = me.extraParams();
                        Ext.apply(eps, params);
                    } else if (Ext.isObject(me.extraParams)) {
                        Ext.apply(eps, me.extraParams);
                    }
                }
                Ext.apply(operation._proxy.extraParams, eps);

                me.fireEvent('beforeload', store, operation,
                    eOpts)
            },
            'load': function (store, records, successful, eOpts) {
                me.fireEvent('load', me, records, successful,
                    eOpts)
            }
        });
        this.callParent(arguments);
        if (this.pageable === true && !Ext.isEmpty(this.paging)) {
            if (this.paging instanceof Ext.toolbar.Paging) {
                this.paging.setStore(store);
            } else {
                this.paging.store = store;
            }
        }
        this.fireEvent('bindstore', store)
        if (this.isVisible()) {

            if (!store.isLoaded() && !store.isLoading()) {
                store.reload();
            }
        }
    }
});