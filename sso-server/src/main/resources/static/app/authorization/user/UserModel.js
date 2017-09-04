Ext.define('App.authorization.user.UserModel', {
            extend : 'Extend.data.BaseModel',
            fields : [{
                        name : 'locked',
                        type : 'boolean',
                        convert : function(val)
                        {
                            if (!Ext.isEmpty(val))
                            {
                                if (val === true)
                                {
                                    return "是";
                                } else
                                {
                                    return "否";
                                }
                            }
                        }
                    }, {
                        name : 'accountExpiringDate',
                        type : 'date'
                    }, {
                        name : 'credentialsExpiringDate',
                        type : 'date'
                    }]
        });
