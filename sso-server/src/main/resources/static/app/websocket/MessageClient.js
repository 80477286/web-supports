Ext.define("App.websocket.MessageClient", {
            extend : "Ext.panel.Panel",
            alias : "widget.MessageClient",
            requires : ['App.websocket.MessageClientController'],
            controller : 'MessageClientController',
            region : 'south',
            layout : 'border',
            initComponent : function()
            {
                window.app.message = window.app.messageClient = this;
                var me = this;
                this.callParent();
                this.on({
                            afterrender : function()
                            {
                                me.socketClient = Ext.create('Extend.websocket.WebSocketClient', {
                                            url : 'WS://' + window.location.hostname + ':10889/websocket'
                                        })
                                me.socketClient.on({
                                            open : function(e)
                                            {
                                                me.fireEvent('open', e)
                                            },
                                            message : function(e)
                                            {
                                                me.fireEvent('message', e)
                                            },
                                            close : function(e)
                                            {
                                                me.fireEvent('close', e)
                                            },
                                            error : function(e)
                                            {
                                                me.fireEvent('error', e)
                                            }
                                        });
                            }
                        });
            },
            items : [{
                        xtype : 'textarea',
                        region : 'center',
                        fieldCls : 'outlog',
                        margin : 3
                    }],
            println : function(value)
            {
                var el = this.down("textarea").getEl();
                if (!Ext.isEmpty(el))
                {
                    var txtDom = el.down(".outlog", true);
                    var msgs = txtDom.value;
                    if (msgs.length > this.maxChars)
                    {
                        msgs = "";
                    }
                    if (!Ext.isEmpty(msgs))
                    {
                        txtDom.value = msgs + '\r\n' + value;
                    } else
                    {
                        txtDom.value = value;
                    }
                    if (this.downflag !== true)
                    {
                        txtDom.scrollTop = txtDom.scrollHeight;
                    }
                } else
                {
                    Ext.log.error("Outlog输出错误，无法获取Textarea元素！")
                }
            },
            send : function(msg, callback)
            {
                this.fireEvent('send', msg, callback);
            },
            subscribe : function(content, callback)
            {
                this.fireEvent('subscribe', content, callback);
            },
            unsubscribe : function(content)
            {
                this.fireEvent('unsubscribe', content);
            }
        })