Ext.define('App.components.form.field.SearchMonthField', {
            extend : 'Extend.form.field.MonthField',
            alias : ['widget.searchmonthfield', 'widget.SearchMonthField'],
            getValue : function()
            {
                var v = this.callParent(arguments);
                v = Ext.Date.format(v, this.format);
                return v;
            }
        })