Ext.define('Extend.form.Basic', {
    extend : 'Ext.form.Basic',
    findField : function(id)
    {
        return this.getFields().findBy(function(field)
        {
            return field.id === id || field.name === id || Ext.String.startsWith(field.name, id + '.')
                    || field.dataIndex === id;
        });
    },
    setValues : function(values)
    {
        var me = this;
        if (Ext.isEmpty(values))
        {
            return;
        }

        // function setVal(fieldId, val)
        // {
        // var field = me.findField(fieldId);
        // if (field)
        // {
        // if (Ext.isObject(val)
        // && Ext.String.startsWith(field.name, fieldId))
        // {
        // val = getValFromObject(field.name
        // .replace(fieldId + ".", ""), val)
        //
        // }
        // field.setValue(val);
        // if (me.trackResetOnLoad)
        // {
        // field.resetOriginalValue();
        // }
        // }
        // }

        // Suspend here because setting the value on a field could trigger
        // a layout, for example if an error gets set, or it's a display field
        Ext.suspendLayouts();
        var fields = this.getFields();
        if (Ext.isEmpty(fields))
        {
            return;
        }
        function getValFromArray(name, values)
        {
            Ext.isEmpty(values)
            {
                return null;
            }
            for (var i = 0; i < values.length; i++)
            {
                var item = values[i];
                if (name === item.id)
                {
                    return item.value;
                }
            }
            return null;
        }
        function getValFromObject(name, values)
        {
            if (Ext.isEmpty(values))
            {
                return null;
            }
            var index = name.indexOf('.');
            if (index > -1)
            {
                if (Ext.isObject(values))
                {
                    var preName = name.substring(0, index);
                    var lastName = name.substring(index + 1, name.length);
                    var nv = values[preName];
                    return getValFromObject(lastName, nv);
                } else
                {
                    return null;
                }
            } else
            {
                return values[name];
            }
        }

        fields.each(function(field)
                {
                    var name = field.name || field.id || field.dataIndex, val;
                    if (!Ext.isEmpty(name))
                    {
                        if (Ext.isArray(values))
                        {
                            val = getValFromArray(name, values);

                        } else
                        {
                            val = getValFromObject(name, values);
                        }
                        field.setValue(val);
                        if (me.trackResetOnLoad)
                        {
                            field.resetOriginalValue();
                        }
                    }
                })

        Ext.resumeLayouts(true);
        return this;
    },
    getValues : function(asString, dirtyOnly, includeEmptyText, useDataValues, isSubmitting)
    {
        var me = this;
        var values = {}, fields = this.getFields().items, fLen = fields.length, isArray = Ext.isArray, field, data, val, bucket, name, f, fullName;

        for (f = 0; f < fLen; f++)
        {
            field = fields[f];
            if (!dirtyOnly || field.isDirty())
            {
                data = field[useDataValues ? 'getModelData' : 'getSubmitData'](includeEmptyText, isSubmitting);

                if (Ext.isObject(data))
                {
                    for (name in data)
                    {
                        if (data.hasOwnProperty(name))
                        {
                            val = data[name];
                            if (val === '')
                            {
                                if (includeEmptyText)
                                {
                                    val = field.emptyText || '';
                                } else
                                {
                                    continue;
                                }

                            }
                            fullName = Ext.isEmpty(me.entity) ? name : (me.entity + ".") + name;
                            if (!field.isRadio)
                            {
                                if (values.hasOwnProperty(fullName))
                                {
                                    bucket = values[fullName];

                                    if (!isArray(bucket))
                                    {
                                        bucket = values[fullName] = [bucket];
                                    }

                                    if (isArray(val))
                                    {
                                        values[fullName] = bucket.concat(val);
                                    } else
                                    {
                                        bucket.push(val);
                                    }
                                } else
                                {
                                    values[fullName] = val;
                                }
                            } else
                            {
                                values[fullName] = values[fullName] || val;
                            }
                        }
                    }
                }
            }
        }

        if (asString)
        {
            values = Ext.Object.toQueryString(values);
        }
        return values;
    },
    getDatas : function(asString, dirtyOnly, includeEmptyText, useDataValues, isSubmitting)
    {
        var values = this.getValues();
        for (var key in values)
        {
            var value = values[key];
            if (key.indexOf('.') > -1)
            {
                var property = key.substring(key.lastIndexOf('.') + 1, key.length);
                var obj = this.createObjects(values, key);
                obj[property] = value;
                delete values[key];
            }
        }
        return values;
    },
    createObjects : function(target, path)
    {
        if (path.indexOf('.') != -1)
        {
            var head = path.substring(0, path.indexOf('.'));
            var end = path.substring(path.indexOf('.') + 1, path.length);
            var regex = /\S*\[\d+\]$/;
            var isArray = regex.test(head);
            if (isArray)
            {
                var property = head.substring(0, head.indexOf('['));
                var index = Math.abs(head.replace(property, "").replace(/[\[]|[\]]/g, ''));
                if (!target[property])
                {
                    target[property] = [];
                }
                if (!target[property][index])
                {
                    target[property][index] = {};
                }
                return this.createObjects(target[property][index], end);
            } else
            {
                if (!target[head])
                {
                    target[head] = {};
                }
                return this.createObjects(target[head], end);
            }
        } else
        {
            return target
        }
    },
    submit : function(opts)
    {
        this.callParent(arguments);
    }
})