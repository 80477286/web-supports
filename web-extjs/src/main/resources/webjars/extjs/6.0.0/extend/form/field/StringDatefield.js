Ext.define('Extend.form.field.StringDatefield', {
            extend : 'Ext.form.field.Date',
            alias : 'widget.StringDatefield',
            getValue : function()
            {
                if (Ext.isDate(this.value))
                {
                    return Ext.Date.format(this.value, this.format);
                } else
                {
                    return this.value;
                }
            },
            setValue : function(value)
            {
                if (Ext.isString(value))
                {
                    var v = Ext.Date.parse(value, this.format);
                    arguments[0] = v;
                    this.callParent(arguments);
                } else
                {
                    this.callParent(arguments);
                }
            }
        })