Ext.define("Extend.form.Panel", {
            extend : 'Ext.form.Panel',
            requires : ['Extend.form.Basic'],
            // ---------------自定义配置项开始--------------------------
            maskText : '保存...',
            // ---------------自定义配置项结束--------------------------
            border : false,
            layout : 'column',
            header : false,
            resetBySave : true,
            config : {
                submitEmptyText : false,
                defaults : {
                    margin : 5,
                    columnWidth : .5,
                    labelAlign : 'right',
                    labelWidth : 100
                }
            },
            createForm : function()
            {
                var cfg = {}, props = this.basicFormConfigs, len = props.length, i = 0, prop;
                for (; i < len; ++i)
                {
                    prop = props[i];
                    cfg[prop] = this[prop];
                    cfg["entity"] = this['entity'];
                }
                return new Extend.form.Basic(this, cfg);
            },
            load : function(opts)
            {
                var me = this;
                var opts = Ext.apply(opts, {
                            action : 'read',
                            url : me.read,
                            success : function(form, action)
                            {
                                me.fireEvent('load', action.result.data)
                            }
                        });
                me.getForm().load(opts);
            },
            loadRecord : function(record)
            {
                var me = this;
                me.reset();
                me.getForm().loadRecord(record);
                me.fireEvent('load', record.getData())
            },
            submit : function()
            {
                var me = this;

                var form = me.getForm();
                var opts = {
                    action : 'save',
                    url : me.url,
                    submitEmptyText : me.submitEmptyText,
                    params : me.getParams(),
                    success : function(form, action)
                    {
                        if (me.resetBySave === true)
                        {
                            me.reset();
                        }
                        me.fireEvent('save', form, action);
                    }
                };
                form.submit(opts);
            },
            reset : function()
            {
                var me = this;
                me.getForm().reset();
            },
            isValid : function()
            {
                var me = this;
                return me.getForm().isValid();
            },
            getParams : function()
            {
                return {};
            },
            getErrors : function()
            {
                var errors = [];
                var fields = this.getForm().getFields();
                for (var i = 0; i < fields.getCount(); i++)
                {
                    var field = fields.getAt(i);
                    var arr = field.getErrors();
                    if (arr.length > 0)
                    {
                        errors.push(arr);
                    }
                }
                return errors;
            },
            getDatas : function()
            {
                return me.getForm().getDatas();
            }
        });