Ext.define('Extend.form.field.CheckCombo', {
    extend : 'Ext.form.field.ComboBox',
    alias : ['widget.checkcombo', 'widget.CheckCombo', 'widget.checkboxcombobox', 'widget.checkcombobox'],
    multiSelect : true,
    lastQuery : '',
    // 添加此属性，可以防止自动加载后，点击时又重新加载（点击时是否重新加载，主要是看这个参数与当前查询字符串是否相等）

    initComponent : function()
    {
        var me = this;
        this.tpl = Ext
                .create(
                        'Ext.XTemplate',
                        '<style type="text/css">',
                        '.x-combo-checker {float:left;margin-right: 3px;background-color: transparent;background-image: url("'
                                + extPath
                                + 'classic/theme-'
                                + theme
                                + '/resources/images/menu/default-unchecked.png"); background-repeat: no-repeat;  height: 16px; width: 16px; margin-top: 2px;}',
                        '.x-boundlist-selected .x-combo-checker {background-image: url("' + extPath + 'classic/theme-'
                                + theme + '/resources/images/menu/default-checked.png");}', '</style>',
                        '<ul class="x-list-plain"><tpl for=".">', '<li role="option" class="x-boundlist-item">'
                                + (me.multiSelect === true ? '<div class="x-combo-checker">' : '') + '</div><div>{'
                                + this.displayField + '}<div></li>', '</tpl></ul>')
        this.callParent(arguments);
        this.on({
                    change : function($this, nv, ov)
                    {
                        var sv = [];
                        if (!Ext.isEmpty(nv))
                        {
                            if (Ext.isArray(nv))
                            {
                                var store = me.getStore();
                                var field = me.valueField || me.displayField;
                                Ext.Array.each(nv, function(item)
                                        {
                                            if (store.query(me.valueField, item).getCount() > 0)
                                            {
                                                sv.push(item);
                                            }
                                        });
                                if (sv.length != nv.length)
                                {
                                    Extend.Msg.error('错误', "字段：“" + me.getName() + '”中部份选项在下拉列表中已经不存在，已经移除，请重新保存！', {
                                                原 : nv,
                                                现 : sv
                                            });
                                    me.setValue(sv);
                                }
                            }
                        }
                    }
                });
    },
    setValue : function(val)
    {
        if (!Ext.isEmpty(val) && Ext.isString(val))
        {
            val = val.replace(/[\s]/g, "");
            arguments[0] = val.split(',');
        }
        this.callParent(arguments);
    },
    isValid : function()
    {
        return this.callParent(arguments);
    },
    getValue : function()
    {
        return this.callParent();
    },
    getStoreListeners : function(store)
    {

        // Don't bother with listeners on the dummy store that is provided for
        // an unconfigured ComboBox
        // prior to a real store arriving from a ViewModel. Nothing is ever
        // going to be fired.
        if (!store.isEmptyStore)
        {
            var me = this, result = {
                datachanged : me.onDataChanged,
                load : me.onLoad,
                exception : me.onException,
                beforeload : me.onBeforeload,
                update : me.onStoreUpdate,
                remove : me.checkValueOnChange
            };

            // If we are doing remote filtering, then mutating the store's
            // filters should not
            // result in a re-evaluation of whether the current value is still
            // present in the store.
            if (!store.getRemoteFilter())
            {
                result.filterchange = me.checkValueOnChange;
            }

            return result;
        }
    },
    onBeforeload : function(store, operation, eOpts)
    {
        this.setReadOnly(true)
    },
    onLoad : function(store, records, successful, eOpts)
    {
        this.setReadOnly(false)
        this.callParent(arguments);
    },
    loadDatas : function(data, append)
    {
        this.loadData(data, append);
    },
    loadData : function(data, append)
    {
        if (!Ext.isEmpty(data))
        {
            this.getStore().loadData(data, append);
        }
    },
    loadRecords : function(records, append)
    {
        if (!Ext.isEmpty(records))
        {
            this.getStore().loadRecords(records, {
                        addRecords : append
                    });
        }
    }
});