Ext.define('App.websocket.MessageClientController', {
            extend : 'Ext.app.ViewController',
            alias : 'controller.MessageClientController',
            // 用于存放flalsh未启动完成而没有发送成功的消息
            subscriber : new Ext.util.MixedCollection(),
            sendQueue : new Ext.util.MixedCollection(),
            init : function(view)
            {
                var me = this;
                var vm = me.getViewModel()
                this.listen({
                            component : {
                                'MessageClient' : {
                                    open : 'onOpenHandler',
                                    close : 'onCloseHandler',
                                    error : 'onErrorHandler',
                                    message : 'onMessageHandler',
                                    send : 'send',
                                    subscribe : 'subscribe',
                                    unsubscribe : 'unsubscribe'
                                }
                            }
                        });
                me.sendTask = new Ext.util.DelayedTask(function()
                        {
                            try
                            {
                                var view = me.getView();
                                var socketClient = view.socketClient;
                                // 如果swf还未加载，则将消息放入队列中，同时启动队列监视
                                if (!Ext.isEmpty(socketClient) && socketClient.getReadyState() == WebSocket.OPEN)
                                {
                                    if (me.sendQueue.getCount() === 0)
                                    {
                                        if (me.sendTask.delayValue < 3)
                                        {
                                            me.sendTask.delayValue++;
                                        }
                                    } else
                                    {
                                        var keys = me.sendQueue.keys;
                                        var msg = keys[keys.length - 1];
                                        var callback = me.sendQueue.getByKey(msg);
                                        if (!Ext.isFunction(callback))
                                        {
                                            callback = null;
                                        }
                                        me.send(msg, callback);
                                        me.sendQueue.removeAtKey(msg);
                                        me.sendTask.delayValue = 0;
                                    }
                                } else
                                {
                                    if (me.sendTask.delayValue < 3)
                                    {
                                        me.sendTask.delayValue++;
                                    }
                                }
                                me.sendTask.delay(me.sendTask.delayValue * 1000);
                            } catch (e)
                            {
                                Ext.log({
                                            level : 'error',
                                            msg : '消息队列中的消息发送失败！',
                                            dump : e
                                        });
                            }
                        });
                me.sendTask.delayValue = 0;
            },
            send : function(msg, callback)
            {
                if (Ext.isEmpty(Ext.String.trim(msg)))
                {
                    return;
                }
                try
                {
                    var me = this;
                    var view = this.getView();
                    var socketClient = view.socketClient;
                    // 如果swf还未加载，则将消息放入队列中，同时启动队列监视
                    if (Ext.isEmpty(socketClient) || socketClient.getReadyState() !== WebSocket.OPEN)
                    {
                        me.sendQueue.add(msg, Ext.isEmpty(callback) ? msg : callback);
                    } else
                    {
                        if (Ext.String.startsWith(msg, 'subscribe:'))
                        {
                            me.subscriber.add(msg.replace(/subscribe:/, ''), callback);
                        }
                        var sended = view.socketClient.send(msg);
                        if (sended)
                        {
                            if (Ext.String.startsWith(msg, 'subscribe:'))
                            {
                                if (!Ext.isEmpty(callback))
                                {
                                    var subscribe = msg.replace(/subscribe:/, '');
                                    try
                                    {
                                        me.subscriber.add(subscribe, callback);
                                    } catch (e)
                                    {
                                        Ext.log({
                                                    level : 'warn',
                                                    msg : '订阅消息时发生异常:' + subscribe,
                                                    dump : e
                                                });
                                    }
                                } else
                                {
                                    Ext.log({
                                                level : 'warn',
                                                msg : '消息订阅时回调函数为空,将不能正确收到消息:' + msg
                                            });
                                }
                            } else if (Ext.String.startsWith(msg, 'unsubscribe:'))
                            {
                                var subscribe = msg.replace(/unsubscribe:/, '');
                                try
                                {
                                    me.subscriber.removeAtKey(subscribe);
                                } catch (e)
                                {
                                    Ext.log({
                                                level : 'warn',
                                                msg : '取消订阅时发生异常:' + subscribe,
                                                dump : e
                                            });
                                }
                            }
                        }
                        return sended;
                    }
                } catch (e)
                {
                    Ext.log({
                                level : 'error',
                                msg : '消息发送失败！',
                                dump : e
                            });
                }
            },
            subscribe : function(content, callback)
            {
                if (!Ext.String.startsWith(content, 'subscribe:'))
                {
                    content = 'subscribe:' + content;
                }

                this.send(content, callback);
            },
            unsubscribe : function(content)
            {
                if (!Ext.String.startsWith(content, 'unsubscribe:'))
                {
                    content = 'unsubscribe:' + content;
                }
                this.send(content);
            },
            onOpenHandler : function(e)
            {
                var me = this;

                Ext.log({
                            level : 'info',
                            dump : {
                                URL : e.target.url
                            },
                            msg : 'Message client was connected.'
                        });
                me.getView().println("连接成功:【" + e.target.url + "】");

                if (!Ext.isEmpty(me.subscriber) && me.subscriber.getCount() > 0)
                {
                    subscriber.eachKey(function(key, item)
                            {
                                me.subscribe(key, item);
                            })
                }
                try
                {
                    var me = this;
                    me.sendTask.delay(100);
                } catch (e)
                {
                    Ext.log({
                                level : 'error',
                                msg : '消息发送器启动失败！',
                                dump : e
                            });
                }
            },
            onMessageHandler : function(content)
            {
                var me = this;
                var messages = [];
                try
                {
                    messages = content.data.split(/[\n]/g);
                } catch (e)
                {
                    Ext.log({
                                level : 'error',
                                msg : '消息处理异常,请检查格式是否正常:' + content,
                                stack : e
                            });
                }
                for (var i = 0; i < messages.length; i++)
                {
                    var message = messages[i];
                    if (Ext.isEmpty(message))
                    {
                        continue;
                    }
                    try
                    {
                        message = Ext.String.trim(message);
                        var json = Ext.decode(message);
                        var callback = me.subscriber.getByKey(json.type);
                        if (Ext.isFunction(callback))
                        {
                            callback.call(me, json);
                        }
                    } catch (e)
                    {
                        Ext.log({
                                    level : 'error',
                                    msg : '消息处理异常,请检查格式是否正常:' + message,
                                    stack : e
                                });
                    }
                }
            },
            onCloseHandler : function(e)
            {
                this.getView().println('连接断开，稍后重连...');
            },
            onErrorHandler : function(e)
            {
                this.getView().println('连接服务器出现错误，请确定服务器已经启动并且URL正确！');
            }
        })