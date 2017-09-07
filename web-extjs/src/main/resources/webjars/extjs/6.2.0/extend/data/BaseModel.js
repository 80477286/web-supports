Ext.define('Extend.data.BaseModel', {
            extend : 'Extend.data.IdentityModel',
            fields : [{
                        name : 'creator',
                        type : 'string'
                    }, {
                        name : 'cdt',
                        type : 'int'
                    }, {
                        name : 'createDatetime',
                        type : 'date',
                        convert : function(v, r)
                        {
                            return new Date(r.get('cdt'));
                        }
                    }]
        });
