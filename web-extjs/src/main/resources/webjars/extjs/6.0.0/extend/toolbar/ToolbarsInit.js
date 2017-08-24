Ext.define('Extend.toolbar.ToolbarsInit', {
            toolbarsInit : function(dockes)
            {
                if (!Ext.isEmpty(dockes) && Ext.isArray(dockes))
                {
                    for (var i = 0; i < dockes.length; i++)
                    {
                        var dock = dockes[i];
                        if (Ext.isEmpty(this[dock]) || Ext.Object.isEmpty(this[dock]))
                        {
                            this[dock] = null;
                            continue;
                        }
                        if (Ext.isObject(this[dock]) && !(this[dock] instanceof Ext.toolbar.Toolbar))
                        {
                            var btns = [], formated = [];
                            Ext.Object.each(this[dock], function(key, value)
                                    {
                                        if (value.hidden !== true && Ext.isObject(value))
                                        {
                                            value.action = value.action || key;
                                            value.iconCls = value.iconCls || key;
                                            btns.push(value);
                                        }
                                    })
                            Ext.Array.sort(btns, function(a, b)
                                    {
                                        a.index = (Ext.isEmpty(a.index) ? Number.MAX_VALUE : a.index);
                                        b.index = (Ext.isEmpty(b.index) ? Number.MAX_VALUE : b.index);
                                        return (a.index === b.index) ? 0 : ((a.index > b.index) ? 1 : -1);
                                    })
                            Ext.Array.each(btns, function(item)
                                    {
                                        if (Ext.isObject(item))
                                        {
                                            if (!Ext.isEmpty(item.before))
                                            {
                                                formated.push(item.before);
                                            }
                                            formated.push(item);
                                            if (!Ext.isEmpty(item.after))
                                            {
                                                formated.push(item.after);
                                            }
                                        } else
                                        {
                                            formated.push(item);
                                        }
                                    })
                            Ext.Array.insert(formated, 0, ['->'])
                            this[dock] = formated;
                        }
                    }
                }
            }
        })