Ext.define("Extend.window.ModalWindow", {
            extend : "Extend.window.ExtendWindow",
            alias : 'widget.modal_window',
            modal : true,
            config : {
                buttons : {
                    ok : {
                        text : '确定',
                        height : 30,
                        minWidth : 50,
                        iconCls : 'ok',
                        index : 0,
                        handler : function()
                        {
                            try
                            {
                                this.up('window').okHandler();
                                this.up('window').fireEvent('ok')
                            } catch (e)
                            {
                            }
                        }
                    },
                    cancel : {
                        text : '取消',
                        height : 30,
                        iconCls : 'cancel',
                        minWidth : 50,
                        index : 1,
                        handler : function()
                        {
                            this.up('window').close();
                        }
                    }
                }
            },
            okHandler : Ext.emptyFn
        })