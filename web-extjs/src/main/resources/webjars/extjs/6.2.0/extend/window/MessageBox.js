Ext.define("Extend.window.MessageBox", {
    extend : 'Ext.window.MessageBox',
    initComponent : function()
    {
        this.callParent(arguments);
        this.coerciveDeleteCheckbox = Ext.create('Ext.form.field.Checkbox', {
                    fieldLabel : '强制断开关联后删除',
                    labelWidth : 130,
                    labelAlign : 'right',
                    labelStyle : 'color:red;',
                    hidden : true
                })
        this.promptContainer.add(this.coerciveDeleteCheckbox);
    },
    reconfigure : function(cfg)
    {
        this.callParent(arguments);
        this.coerciveDeleteCheckbox.setValue(false);
        if (cfg.coerciveDeleteConfirm === true)
        {
            this.coerciveDeleteCheckbox.show();
        } else
        {
            this.coerciveDeleteCheckbox.hide();
        }
    },
    error : function(cfg, error, messages, errors, exception)
    {
        var me = this;
        if (!Ext.isObject(cfg))
        {
            cfg = {
                title : cfg,
                msg : error,
                messages : messages,
                errors : errors,
                exception : exception,
                buttons : Ext.MessageBox.OK,
                icon : Ext.MessageBox.ERROR,
                maxWidth : 1024,
                scope : me
            };
        }
        me._formatMessage(cfg);
        me.autoScroll = true;
        me.show(cfg);
    },
    confirm : function(cfg, msg, messages, fn, coercive)
    {
        var me = this;
        if (!Ext.isObject(cfg))
        {
            cfg = {
                title : cfg,
                msg : msg,
                messages : messages,
                buttons : Ext.MessageBox.YESNO,
                icon : Ext.MessageBox.QUESTION,
                maxWidth : 1024,
                callback : fn,
                scope : me,
                coerciveDeleteConfirm : coercive
            };
        }
        me._formatMessage(cfg);
        me.autoScroll = true;
        me.show(cfg);
    },
    warn : function(cfg, msg, messages, errors)
    {
        var me = this;
        if (!Ext.isObject(cfg))
        {
            cfg = {
                title : cfg,
                msg : msg,
                messages : messages,
                errors : errors,
                buttons : Ext.MessageBox.OK,
                icon : Ext.MessageBox.WARNING,
                maxWidth : 1024,
                scope : me
            };
        }
        me._formatMessage(cfg);
        me.autoScroll = true;
        me.show(cfg);
    },
    info : function(cfg, msg, messages, errors)
    {
        var me = this;
        if (!Ext.isObject(cfg))
        {
            cfg = {
                title : cfg,
                msg : msg,
                messages : messages,
                errors : errors,
                buttons : Ext.MessageBox.OK,
                icon : Ext.MessageBox.INFO,
                maxWidth : 1024,
                scope : me
            };
        }
        me._formatMessage(cfg);
        me.autoScroll = true;
        me.show(cfg);
    },
    _formatMessage : function(cfg)
    {
        var titleColor = '#333';
        if (cfg.icon == Ext.Msg.ERROR)
        {
            titleColor = 'red';
        } else if (cfg.icon == Ext.Msg.WARNING)
        {
            titleColor = '#FF4242';
        }
        var msg = '';
        if (cfg.msg && Ext.isString(cfg.msg))
        {
            msg += ('<div style="color:' + titleColor + ';font-weight:bold;font-size:13px;margin-bottom:5px;">'
                    + cfg.msg + '</div>');
        }
        if (Ext.isString(cfg.messages))
        {
            msg += ('<div style="margin-top:10px;border-bottom:1px solid #333;">Messages:</div><div style="color:#666;">'
                    + cfg.messages + '</div>');
        } else if (Ext.isArray(cfg.messages) && cfg.messages.length > 0)
        {
            msg += ('<div style="margin-top:10px;border-bottom:1px solid #333;">Messages:</div><ul  style="list-style: decimal;margin:0px 0px 0px 40px;padding:0px;color:#666;">');
            for (var i = 0; i < cfg.messages.length; i++)
            {
                var val = cfg.messages[i];
                msg += ('<li style="padding:0;margin:0;">');
                msg += (val);
                msg += ('</li>');
            }
            msg += ('</ul>');
        } else if (Ext.isObject(cfg.messages))
        {
            msg += ('<div style="margin-top:10px;border-bottom:1px solid #333;">Messages:</div><ul  style="list-style: none;margin:0px 0px 0px 40px;padding:0px;color:#666;">');
            for (key in cfg.messages)
            {
                var val = cfg.messages[key];
                msg += ('<li style="padding:0;margin:0;">');
                msg += ('<span style="font-weight:bold;color:#FF9933;margin-left:-18px;">' + key + '：</span>' + val);
                msg += ('</li>');
            }
            msg += ('</ul>');
        }

        if (Ext.isString(cfg.errors))
        {
            msg += ('<div style="margin-top:10px;border-bottom:1px solid rgb(204,51,0);">Errors:</div><div style="color:rgb(204,51,0);">'
                    + cfg.errors + '</div>');
        } else if (Ext.isArray(cfg.errors) && cfg.errors.length > 0)
        {
            msg += ('<div style="margin-top:10px;border-bottom:1px solid rgb(204,51,0);">Errors:</div><ul  style="list-style: decimal;margin:0px 0px 0px 40px;padding:0px;color:rgb(204,51,0);">');
            for (var i = 0; i < cfg.errors.length; i++)
            {
                var val = cfg.errors[i];
                if (Ext.isString(val))
                {
                    val = val.replace(/\r\n/g, "\n").replace(/\n/g, "<br/>");
                }
                msg += ('<li style="padding:0;margin:0;">');
                msg += (val);
                msg += ('</li>');
            }
            msg += ('</ul>');
        } else if (Ext.isObject(cfg.errors))
        {
            msg += ('<div style="margin-top:10px;border-bottom:1px solid rgb(204,51,0);">Errors:</div><ul  style="list-style: none;margin:0px 0px 0px 40px;padding:0px;color:rgb(204,51,0);">');
            for (key in cfg.errors)
            {
                var val = cfg.errors[key];
                if (Ext.isString(val))
                {
                    val = val.replace(/\r\n/g, "\n").replace(/\n/g, "<br/>");
                }
                msg += ('<li style="padding:0;margin:0;">');
                msg += ('<span style="font-weight:bold;color:#FF9933;margin-left:-18px;">' + key + '：</span>' + val);
                msg += ('</li>');
            }
            msg += ('</ul>');
        }

        if (Ext.isObject(cfg.exception))
        {
            msg += ('<div style="margin-top:10px;border-bottom:1px solid red;color:red;">Exception:</div><div style="font-weight:bold;color:#FF9933;margin:0px 0px 0px 40px;">'
                    + cfg.exception.localizedMessage + '：</div>');
            if (Ext.isArray(cfg.exception.stackTrace))
            {
                msg += ('<div style="margin-top:10px;border-bottom:1px solid red;color:red;">Exception:</div><ul  style="list-style: none;margin:0px 0px 0px 40px;padding:0px;">');
                for (var i = 0; i < cfg.exception.stackTrace.length; i++)
                {
                    var line = cfg.exception.stackTrace[i];
                    msg += ('<li style="padding:0;margin:0;">');
                    msg += (line.className + '<span style="color:#003399;">(' + line.fileName + ":" + line.lineNumber + ')</span>');
                    msg += ('</li>');
                }
            }
            msg += ('</ul>');
        } else if (Ext.isString(cfg.exception))
        {
            var str = cfg.exception.replace(/[\n]|[\r]|[\r\n]|[\r\n]/g, "\n");
            var arr = str.split("\n");
            if (Ext.isArray(arr))
            {
                msg += ('<div style="margin-top:10px;border-bottom:1px solid red;color:red;">Exception:</div><ul  style="list-style: none;margin:0px 0px 0px 40px;padding:0px;">');
                for (var i = 0; i < arr.length; i++)
                {
                    var line = arr[i];
                    if (i == 0 || Ext.String.startsWith(line, 'Caused by'))
                    {
                        line = '<div style="font-weight:bold;color:#FF9933;">' + line + '</div>';
                        msg += ('<li style="padding:0;margin:0;">');
                        msg += line;
                        msg += ('</li>');
                    } else
                    {
                        msg += ('<li style="padding:0;margin:0;">');
                        msg += line;
                        msg += ('</li>');
                    }
                }
            }
            msg += ('</ul>');
        }
        cfg.msg = msg;
    }
}, function()
{
    Extend.Msg = Extend.MessageBox = new this();
})