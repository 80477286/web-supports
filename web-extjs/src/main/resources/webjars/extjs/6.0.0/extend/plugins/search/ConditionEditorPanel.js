/**
 * 编辑搜索条件的表格
 * 
 */
Ext.define("Extend.plugins.search.ConditionEditorPanel", {
            extend : "Ext.grid.Panel",
            stateful : true,
            forceFit : true,
            stateId : Ext.id(),
            disableSelection : false,
            minHeight : 95,
            operations : Ext.create("Ext.util.MixedCollection"),
            operationMap : {
                '>' : ""
            },
            region : 'center',

            // 删除
            deleteRows : function()
            {
                var me = this;
                var sm = me.getSelectionModel();
                var records = sm.getSelection();
                me.store.remove(records);
            },
            addRow : function()
            {
                var me = this;
                me.store.insert(me.store.getCount(), {});
            },

            initComponent : function()
            {
                var me = this;

                var fields = me.fields;
                me.initOperations();
                me.initCellEditor();

                me.tbar = ['->', {
                            text : '添加',
                            iconCls : 'row_add',
                            handler : function()
                            {
                                me.addRow();
                            }
                        }, {
                            text : '删除',
                            iconCls : 'row_delete',
                            handler : function()
                            {
                                me.cellEditor.completeEdit();
                                me.deleteRows();
                            }
                        }];
                me.store = Ext.create('Ext.data.Store', {
                            fields : ['field', 'operation', 'value'],
                            data : null,
                            proxy : {
                                type : 'memory'
                            }
                        });
                me.columns = [{
                            text : '字段',
                            dataIndex : 'field',
                            sortable : false,
                            draggable : false,
                            editor : Ext.create('Ext.form.ComboBox', {
                                        store : Ext.create('Ext.data.Store', {
                                                    fields : ['name', 'field'],
                                                    data : fields
                                                }),
                                        submitValue : false,
                                        emptyText : '字段',
                                        queryMode : 'local',
                                        displayField : 'name',
                                        valueField : 'field',
                                        editable : false,
                                        allowBlank : false,
                                        blankText : '查询字段不能为空!'
                                    }),
                            renderer : function(value)
                            {
                                if (value)
                                {
                                    var field = me.getField(value);
                                    if (field)
                                    {
                                        return field.name;
                                    }
                                }
                                return value;
                            }
                        }, {
                            text : '比较方式',
                            dataIndex : 'operation',
                            sortable : false,
                            draggable : false,
                            submitValue : false,
                            editor : {
                                xtype : 'textfield'
                            },
                            editable : false,
                            renderer : function(value)
                            {
                                if (value)
                                {
                                    var opt = me.operations.get("map1")[value];
                                    if (opt)
                                    {
                                        return opt;
                                    }
                                }
                                return value;
                            }
                        }, {
                            text : '值',
                            dataIndex : 'value',
                            sortable : false,
                            draggable : false,
                            submitValue : false,
                            editor : {
                                xtype : 'textfield',
                                emptyText : '查询值',
                                allowBlank : false,
                                blankText : '查询参数不能为空!'
                            },
                            renderer : function(value, md, record)
                            {
                                var dv = record.get("dv");
                                return dv ? dv : value;
                            }
                        }]

                me.callParent(arguments);
            },
            getField : function(fieldName)
            {
                for (var i = 0; i < this.fields.length; i++)
                {
                    var item = this.fields[i];
                    if (item.field == fieldName)
                    {
                        return item;
                    }

                }
                return null;
            },
            initOperations : function()
            {
                var opts = this.operations;
                var numberopts = [['>', 'gt'], ['>=', 'ge'], ['<', 'lt'], ['<=', 'le'], ['=', 'eq'], ['!=', 'ne'],
                        ['is null', "isnull"], ['is not null', "isnotnull"]];
                opts.add('i', numberopts);
                opts.add('b', numberopts);
                opts.add('f', numberopts);
                opts.add('d', numberopts);
                opts.add('l', numberopts);
                opts.add('dt', numberopts);
                opts.add('s', [['=', 'eq'], ['like', 'like'], ['!=', 'ne'], ['is null', "isnull"],
                                ['is not null', "isnotnull"]]);
                opts.add('bl', [['=', 'eq'], ['!=', 'ne'], ['is null', "isnull"], ['is not null', "isnotnull"]]);

                // 数据库中存储方式为TEXT时使用
                opts.add('tx', [['like', 'like'], ['is null', 'isnull'], ['is not null', 'isnotnull']])
                opts.add("map1", {
                            '>' : "gt",
                            '>=' : "ge",
                            '<' : "lt",
                            '<=' : "le",
                            '=' : "eq",
                            '!=' : "ne",
                            'like' : "like",
                            'is null' : "isnull",
                            'is not null' : "isnotnull"
                        });
                opts.add("map1", {
                            'gt' : ">",
                            'ge' : ">=",
                            'lt' : "<",
                            'le' : "<=",
                            'eq' : "=",
                            'ne' : "!=",
                            'like' : "like",
                            'isnull' : "is null",
                            'isnotnull' : "is not null"
                        });
            },
            initCellEditor : function()
            {
                var me = this;

                me.cellEditor = Ext.create('Ext.grid.plugin.CellEditing', {
                            clicksToEdit : 1,
                            listeners : {
                                beforeedit : function(editorPlugin, e, eOpts)
                                {
                                    // 查询字段的类型(默认为string)
                                    var editor = e.column.getEditor();
                                    editor.disable();
                                    var field = me.getField(e.record.get("field"));
                                    // 根据查询字段类型，获取比较方式
                                    if (e.colIdx == 0)
                                    {

                                        var changeHandler = function(t, n, o)
                                        {

                                            this.record.set("dv", "")
                                            this.record.set("value", null)
                                            this.record.set("operation", null)
                                        }
                                        editor = Ext.create('Ext.form.ComboBox', {
                                                    store : Ext.create('Ext.data.Store', {
                                                                fields : ['name', 'field'],
                                                                data : me.fields
                                                            }),
                                                    emptyText : '字段',
                                                    queryMode : 'local',
                                                    displayField : 'name',
                                                    valueField : 'field',
                                                    editable : false,
                                                    allowBlank : false,
                                                    blankText : '查询字段不能为空!'
                                                });
                                        editor.addListener("change", changeHandler, e);
                                        e.column.setEditor(editor);
                                    }
                                    if (field)
                                    {
                                        var vtype = field.vtype;
                                        if (e.colIdx == 1)
                                        {
                                            var ops = field.opts ? field.opts : me.operations.get(vtype);
                                            // 创建比较方式编辑器
                                            editor = Ext.create('Ext.form.ComboBox', {
                                                        store : Ext.create('Ext.data.ArrayStore', {
                                                                    fields : [{
                                                                                name : 'name',
                                                                                mapping : 0
                                                                            }, {
                                                                                name : 'value',
                                                                                mapping : 1
                                                                            }],
                                                                    data : ops
                                                                }),
                                                        emptyText : '比较方式',
                                                        displayField : 'name',
                                                        valueField : 'value',
                                                        editable : false,
                                                        allowBlank : false,
                                                        blankText : '比较方式不能为空!'
                                                    });
                                            e.column.setEditor(editor);
                                        }
                                        if (e.colIdx == 2)
                                        {
                                            if (vtype == 'bl' || (field.datas && field.datas.length > 0))
                                            {
                                                // 创建下拉框
                                                var xtype = 'Ext.form.ComboBox';
                                                if (field.checked == true)
                                                {
                                                    xtype = 'Extend.form.field.CheckCombo'
                                                }
                                                editor = Ext.create(xtype, {
                                                            store : Ext.create('Ext.data.ArrayStore', {
                                                                        fields : ['name', "value"],
                                                                        data : field.datas ? field.datas : [
                                                                                ["True", "true"], ["False", "False"]]
                                                                    }),
                                                            emptyText : '查询值',
                                                            queryMode : 'local',
                                                            displayField : 'name',
                                                            valueField : 'value',
                                                            editable : false,
                                                            allowBlank : false,
                                                            blankText : '查询参数不能为空!'
                                                        });
                                            } else if (vtype == 'i' || vtype == 'f' || vtype == 'd' || vtype == 'b'
                                                    || vtype == 'l')
                                            {
                                                // 创建数字输入框
                                                editor = Ext.create("Ext.form.NumberField", {
                                                            emptyText : '查询值',
                                                            allowBlank : false,
                                                            blankText : '查询参数不能为空!'
                                                        });
                                            } else if (vtype == "s" || vtype == 'tx')
                                            {
                                                editor = Ext.create("Ext.form.TextField", {
                                                            emptyText : '查询值',
                                                            allowBlank : false,
                                                            blankText : '查询参数不能为空!'
                                                        });
                                            } else if (vtype == 'dt')
                                            {
                                                editor = Ext.create('Ext.form.field.Date', {
                                                            format : 'Y-m-d',
                                                            emptyText : '查询值',
                                                            editable : false,
                                                            allowBlank : false,
                                                            blankText : '查询参数不能为空!'
                                                        });
                                            }
                                            if (editor instanceof Extend.form.field.CheckCombo)
                                            {
                                                editor.on({
                                                            "change" : function(t, n, o)
                                                            {
                                                                var dv = [];
                                                                for (var i = 0; i < n.length; i++)
                                                                {
                                                                    var v = n[i];
                                                                    var lst = this.getStore().query('value', v);
                                                                    if (lst.getCount() > 0)
                                                                    {
                                                                        dv.push(lst.getAt(0).get('name'));
                                                                    } else
                                                                    {
                                                                        dv.push(n);
                                                                    }
                                                                }
                                                                e.record.set("dv", dv)
                                                            }
                                                        })
                                            } else if (editor instanceof Ext.form.field.ComboBox)
                                            {
                                                editor.on({
                                                            "change" : function(t, n, o)
                                                            {
                                                                var dv = n;

                                                                for (var i = 0; i < this.getStore().getCount(); i++)
                                                                {
                                                                    var record = this.getStore().getAt(i);
                                                                    if (record.get("value") == n)
                                                                    {
                                                                        dv = record.get("name");
                                                                        break;
                                                                    }
                                                                }
                                                                e.record.set("dv", dv)
                                                            }
                                                        })
                                            }
                                            if (e.record.get("operation") != "isnull"
                                                    && e.record.get("operation") != "isnotnull")
                                            {
                                                editor.enable();
                                            } else
                                            {
                                                editor.disable();
                                            }
                                            e.column.setEditor(editor);
                                        }
                                    }
                                    if (editor instanceof Ext.form.field.ComboBox)
                                    {
                                        if (editor.xtype == 'combobox')
                                        {
                                            editor.on("change", function()
                                                    {
                                                        if (editor.isValid())
                                                        {
                                                            editorPlugin.completeEdit();
                                                        }
                                                    })
                                        }
                                    }
                                }
                            }

                        });
                me.plugins = [me.cellEditor];
            },
            isValid : function()
            {
                var me = this;
                me.cellEditor.completeEdit();
                var store = me.getStore();
                for (var i = 0; i < store.getCount(); i++)
                {
                    var record = store.getAt(i);
                    if (!record.get('field'))
                    {
                        me.cellEditor.startEdit(record, 0);
                        return false;
                    }
                    if (!record.get('operation'))
                    {
                        me.cellEditor.startEdit(record, 1);
                        return false;
                    }
                    if (record.get('operation') != 'isnull' && record.get('operation') != 'isnotnull'
                            && record.get('value').length == 0)
                    {
                        me.cellEditor.startEdit(record, 2);
                        return false;
                    }
                }
                return true;
            },
            getParams : function()
            {
                var me = this;
                me.cellEditor.completeEdit();
                var store = me.getStore();
                var params = {};
                for (var i = 0; i < store.getCount(); i++)
                {
                    var record = store.getAt(i);
                    // 判断是否是null判断操作
                    var nullOpt = record.get('operation') == 'isnull' || record.get('operation') == 'isnotnull';
                    var field = me.getField(record.get("field"));
                    var opt = record.get("operation");
                    var value = nullOpt ? opt : record.get("value");
                    var vtype = nullOpt ? "s" : field.vtype;
                    params["params." + field.field + "_" + vtype + "_" + opt] = value;
                }
                return params;
            }
        });