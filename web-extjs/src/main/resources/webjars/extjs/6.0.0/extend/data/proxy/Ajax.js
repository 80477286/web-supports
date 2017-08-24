Ext.define('Extend.data.proxy.Ajax', {
            extend : 'Ext.data.proxy.Ajax',
            alias : 'proxy.majax',
            read : function(oper)
            {
                if (!Ext.isEmpty(this.api.get))
                {
                    if (Ext.isEmpty(this.api.query)
                            && !Ext.isEmpty(this.api.read))
                    {
                        this.api.query = this.api.read;
                    }

                    if (!Ext.isEmpty(oper.getId()))
                    {
                        this.api.read = this.api.get;
                    } else
                    {
                        this.api.read = this.api.query;
                    }
                }
                this.callParent(arguments);
            }
        })