Ext.define('Extend.data.IdentityModel', {
            extend : 'Ext.data.Model',
            requires : ['Extend.data.proxy.Ajax'],
            identifier : 'uuid',
            idProperty : 'id',// default value："id"
            clientIdProperty : 'params.id_s_eq',
            fields : [{
                        name : 'id',
                        type : 'string'
                    }]
        });
