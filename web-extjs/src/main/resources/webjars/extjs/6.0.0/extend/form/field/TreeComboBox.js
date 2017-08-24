Ext.define('Extend.form.field.TreeComboBox', {
            extend : 'Ext.form.field.Picker',
            alias : 'widget.treecombobox',
            uses : ['Ext.tree.Panel'],
            config : {
                /**
                 * @cfg {Ext.data.TreeStore} store A tree store that the tree
                 *      picker will be bound to
                 */
                store : null,
                /**
                 * @cfg {String} displayField The field inside the model that
                 *      will be used as the node's text. Defaults to the default
                 *      value of {@link Ext.tree.Panel}'s `displayField`
                 *      configuration.
                 */
                displayField : null,
                valueField : null,
                /**
                 * @cfg {Array} columns An optional array of columns for
                 *      multi-column trees
                 */
                columns : null,
                /**
                 * @cfg {Boolean} selectOnTab Whether the Tab key should select
                 *      the currently highlighted item. Defaults to `true`.
                 */
                selectOnTab : true,
                /**
                 * @cfg {Number} maxPickerHeight The maximum height of the tree
                 *      dropdown. Defaults to 300.
                 */
                maxPickerHeight : 350,
                minPickerHeight : 150,
                rootVisible : true,
                root : {},
                selModel : {
                    selType : 'treemodel',
                    mode : 'SINGLE'
                }
            },
            editable : false,
            reset : function()
            {
                this.setRawValue();
                this.callParent(arguments);
            },
            createPicker : function()
            {
                var me = this;
                me.picker = Ext.create('Extend.tree.Panel', {
                            shrinkWrapDock : 2,
                            store : me.store,
                            floating : true,
                            displayField : me.displayField,
                            valueField : me.valueField,
                            columns : me.columns,
                            maxHeight : me.maxPickerHeight,
                            minHeight : me.minPickerHeight,
                            rootVisible : me.rootVisible,
                            manageHeight : true,
                            disableSelection : this.selModel.mode === 'MULTI',
                            shadow : true,
                            border : true,
                            root : me.root,
                            selModel : me.selModel,
                            listeners : {
                                scope : me,
                                afteritemexpand : me.onItemExpand,
                                afterrender : function()
                                {
                                    Ext.defer(function()
                                            {
                                                if (!me.picker.getStore().autoLoad && !me.picker.autoLoad)
                                                {
                                                    me.picker.getRootNode().expand();
                                                }
                                            }, 10);

                                },
                                select : function($this, record)
                                {
                                    if (!Ext.isEmpty(record.data.checked))
                                    {
                                        record.set('checked', true);
                                    }
                                },
                                deselect : function($this, record)
                                {
                                    if (!Ext.isEmpty(record.data.checked))
                                    {
                                        record.set('checked', false);
                                    }
                                },
                                checkchange : function(node, checked, eOpts)
                                {
                                    var me = this.picker;
                                    me.fireEvent('selectionchange', this.picker, me.getChecked())
                                },
                                selectionchange : me.onSelectionChange
                            },
                            viewConfig : {
                                listeners : {
                                    scope : me,
                                    render : me.onViewRender
                                }
                            }
                        });

                me.mon(me.store, {
                            scope : me,
                            load : me.onLoad,
                            update : me.onUpdate,
                            beforeload : me.onBeforeload
                        });
                me.view = me.picker.getView();
                if (Ext.isIE9 && Ext.isStrict)
                {
                    me.view.on({
                                scope : me,
                                highlightitem : me.repaintPickerView,
                                unhighlightitem : me.repaintPickerView,
                                afteritemexpand : me.repaintPickerView,
                                afteritemcollapse : me.repaintPickerView
                            });
                }
                return me.picker;
            },
            onItemExpand : function(record)
            {
                try
                {
                    var me = this;
                    var vn = me.picker.getView().getNode(record);
                    if (!Ext.isEmpty(vn))
                    {
                        var top = vn.offsetTop;

                        var oldSy = me.picker.getView().getScrollY();
                        var height = me.picker.getView().getHeight();

                        if (top > oldSy + height)
                        {
                            me.picker.getView().scrollTo(0, top - height / 2);
                        }
                    }
                } catch (e)
                {
                    Ext.log({
                                level : 'error',
                                msg : '调整滚动条位置出现异常',
                                stack : e
                            });
                }
            },
            onViewRender : function(view)
            {
                view.getEl().on('keypress', this.onPickerKeypress, this);
            },
            /**
             * repaints the tree view
             */
            repaintPickerView : function()
            {
                var style = this.picker.getView().getEl().dom.style;
                // can't use Element.repaint because it contains a setTimeout,
                // which
                // results in a flicker effect
                style.display = style.display;
            },
            onSelectionChange : function($this, selected, eOpts)
            {
                var me = this;
                if (Ext.isEmpty(selected) || selected.length == 0)
                {
                    me.setValue([]);
                } else
                {
                    var values = [];
                    Ext.Array.each(selected, function(item)
                            {
                                values.push(item.data);
                            })
                    me.setValue(values);
                }
                if (me.selModel.mode === 'SINGLE')
                {
                    me.collapse();
                }
            },
            /**
             * Handles a keypress event on the picker element
             * 
             * @private
             * @param {Ext.event.Event}
             *            e
             * @param {HTMLElement}
             *            el
             */
            onPickerKeypress : function(e, el)
            {
                var key = e.getKey();
                if (key === e.ENTER || (key === e.TAB && this.selectOnTab))
                {
                    this.selectItem(this.picker.getSelectionModel().getSelection()[0]);
                }
            },
            /**
             * Runs when the picker is expanded. Selects the appropriate tree
             * node based on the value of the input element, and focuses the
             * picker so that keyboard navigation will work.
             * 
             * @private
             */
            onExpand : function()
            {
                var me = this, picker = me.picker, store = picker.store, value = me.value, node;
                if (value)
                {
                    if (me.valueField)
                    {
                        var rs = me.store.query(me.valueField, value);
                        if (rs.getCount() > 0)
                        {
                            node = rs.getAt(0);
                        }
                    } else
                    {
                        node = me.store.getNodeById(value);
                    }
                }
                if (node)
                {
                    picker.selectPath(node.getPath());
                }
            },
            /**
             * Sets the specified value into the field
             * 
             * @param {Mixed}
             *            value
             * @return {Ext.ux.TreePicker} this
             */
            setValue : function(value)
            {
                var me = this, record, oldValue;
                oldValue = me.value;
                var values = [];
                var rowValues = [];
                if (Ext.isString(value))
                {
                    value = value.replace(/\s/g, "").replace(/[, ]/g, ",");
                    values = value.split(',');
                    rowValues = values;
                } else if (Ext.isArray(value))
                {
                    for (var i = 0; i < value.length; i++)
                    {
                        var item = value[i];
                        if (Ext.isObject(item))
                        {
                            values.push(item[me.valueField || 'id']);
                            rowValues.push(item[me.displayField || 'id']);
                        } else if (Ext.isString(item))
                        {
                            values.push(item);
                            rowValues.push(item);
                        }
                    }
                }
                me.value = values;
                
                //2016-08-24：因为任务编辑中的任务人不显示 先把的人的名字，所以将以下两行移到判断me.picker是否为空之前
                me.setRawValue(rowValues.toString());
                me.fireEvent('change', me, me.value, oldValue)
                if (Ext.isEmpty(me.picker) || me.picker.store.loading)
                {
                    return me;
                }
                return me;
            },
            getSubmitValue : function()
            {
                return this.value;
            },
            /**
             * Returns the current data value of the field (the idProperty of
             * the record)
             * 
             * @return {Number}
             */
            getValue : function()
            {
                return this.value;
            },
            onBeforeload : function()
            {
                var me = this;
                me.disable();
            },
            /**
             * Handles the store's load event.
             * 
             * @private
             */
            onLoad : function(store, records, successful, operation, node, eOpts)
            {
                var me = this;
                me.enable();
                var value = this.value;
                if (value)
                {
                    if (Ext.isString(value))
                    {
                        value = [value];
                    }
                    Ext.Array.each(value, function(item)
                            {
                                me.selectByValue(me.picker.getRootNode(), item);
                            })
                }
            },
            onUpdate : function(store, rec, type, modifiedFieldNames)
            {
                var display = this.displayField;
                if (type === 'edit' && modifiedFieldNames && Ext.Array.contains(modifiedFieldNames, display)
                        && this.value === (this.valueField ? rec.get(this.valueField) : rec.getId()))
                {
                    this.setRawValue(rec.get(display));
                }
            },
            selectByValue : function(node, value)
            {
                var me = this;
                if (node.isRoot())
                {
                    if (node.isLoaded() && node.isLeaf() !== true)
                    {
                        for (var i = 0; i < node.childNodes.length; i++)
                        {
                            var item = node.childNodes[i];
                            me.selectByValue(item, value);
                        }
                    } else
                    {
                        node.expand(false, function()
                                {
                                    for (var i = 0; i < node.childNodes.length; i++)
                                    {
                                        if (Ext.String.startsWith(value, node.get(me.valueField)))
                                        {
                                            var item = node.childNodes[i];
                                            me.selectByValue(item, value);
                                        }
                                    }
                                })
                    }
                } else
                {
                    if (value == node.get(me.valueField))
                    {
                        if (this.selModel.mode === 'MULTI')
                        {
                            node.set('checked', true);
                        } else
                        {
                            var sm = me.picker.getSelectionModel();
                            if (sm)
                            {
                                sm.suspendEvent("selectionchange")
                                sm.select([node]);
                                sm.resumeEvent("selectionchange")
                            }
                        }
                        me.fireEvent('checkchange', node, true, null);
                    } else if (Ext.String.startsWith(value, node.get(me.valueField)))
                    {
                        if (node.isLoaded() && node.isLeaf() !== true)
                        {
                            for (var i = 0; i < node.childNodes.length; i++)
                            {
                                var item = node.childNodes[i];
                                me.selectByValue(item, value);
                            }
                        } else
                        {
                            node.expand(false, function()
                                    {
                                        for (var i = 0; i < node.childNodes.length; i++)
                                        {
                                            var item = node.childNodes[i];
                                            me.selectByValue(item, value);
                                        }
                                    })
                        }
                    }
                }
            }
        });