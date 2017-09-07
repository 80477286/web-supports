/**
 * 在FORM表单没有指定Model或Model中日期字段不是date类型时,需要正常显示指定格式的日期时使用此类。
 * 如果指定了Model并且日期类型为date时， 可直接使用datefield显示
 */
Ext.define('Extend.form.field.YmdDateField', {
            extend : 'Ext.form.field.Date',
            alias : ['widget.YmdDateField', 'widget.ymddatefield'],
            format : 'Y-m-d',
            initComponent : function()
            {
                this.format = 'Y-m-d';
                this.callParent(arguments);
            },
            setValue : function(val)
            {
                if (Ext.isString(val))
                {
                    val = new Date(val);
                }
                arguments[0] = val;
                this.callParent(arguments);
            }
        });