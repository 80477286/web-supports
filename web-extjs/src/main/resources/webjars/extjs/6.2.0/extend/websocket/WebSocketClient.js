Ext.define('Extend.websocket.WebSocketClient', {
            mixins : ['Ext.mixin.Observable'],
            socket : null,
            autoConnect : true,
            constructor : function(config)
            {
                var me = this;

                me.connectTask = new Ext.util.DelayedTask(function()
                        {
                            me.connect(me.url);
                        });
                me.mixins.observable.constructor.call(me, config);
                if (me.autoConnect == true)
                {
                    if (!Ext.isEmpty(me.url))
                    {
                        me.connect(me.url);
                    } else
                    {
                        Ext.log({
                                    level : 'error',
                                    msg : '未指定WebSocket服务器地址！'
                                })
                    }
                }
            },
            send : function(msg)
            {
                this.socket.send(msg);
            },
            close : function()
            {
                this.socket.close();
            },
            connect : function(url)
            {
                var me = this;
                me.url = url;
                if (!Ext.isEmpty(me.url))
                {
                    me.socket = new WebSocket(me.url);
                    me.bindEvent(me.socket);
                } else
                {
                    Ext.log({
                                level : 'error',
                                msg : '未指定WebSocket服务器地址！'
                            })
                }
            },
            bindEvent : function(socket)
            {
                var me = this;
                socket.onopen = function(e)
                {
                    me.onOpen.call(me, e)
                };
                socket.onmessage = function(e)
                {
                    me.onMessage.call(me, e)
                };
                socket.onclose = function(e)
                {
                    me.onClose.call(me, e)
                };
                socket.onerror = function(e)
                {
                    me.onError.call(me, e)
                };
            },
            onOpen : function(e)
            {
                this.fireEvent('open', e)
            },
            onMessage : function(e)
            {
                this.fireEvent('message', e)
            },
            onClose : function(e)
            {
                this.fireEvent('close', e)

                Ext.log({
                            level : 'error',
                            msg : "连接断开，1秒后重连..."
                        })
                this.connectTask.delay(1000);
            },
            onError : function(e)
            {
                this.fireEvent('error', e)
                Ext.log({
                            level : 'error',
                            msg : "连接失败，1秒后重连..."
                        })
                this.connectTask.delay(1000);
            },
            getReadyState : function()
            {
                if (Ext.isEmpty(this.socket))
                {
                    return -1;
                } else
                {
                    return this.socket.readyState;
                }
            }
        })