
/**
 * ## loadRecord/load(remote)
 * 
 * @example
 * Ext.create('MExt.window.FormWindow', {
 *            url : 'authorization/user/save',
 *            items : [{
 *                        xtype : 'textfield',
 *                        fieldLabel : 'Username',
 *                        allowBlank : false,
 *                        name : 'username'
 *                    }],
 *        }).show({
 *            //此函数属性用于构建window，会merge MExt.window.FormWindow.window配置项
 *            modal : false
 *        }).load({
 *            url : 'authorization/user/load',
 *            params : {
 *                id : '05c0d3d1-b6b8-49b9-808c-0264d3197e34'
 *            }
 *        });
 * 
 * Ext.create('MExt.window.FormWindow', {
 *           url : 'authorization/user/save',
 *           items : [{
 *                       xtype : 'textfield',
 *                       fieldLabel : 'Username',
 *                       allowBlank : false,
 *                       name : 'username'
 *                  }],
 *           window:{
 *             //此属性用于构建window,会merge内置配置项
 *              modal : false,
 *              buttons:{
 *                  reset:{
 *                      hidden:true
 *                  }
 *              }
 *           }
 *      }).show().loadRecord(Ext.create('Ext.data.Model', {
 *          username : 'test'
 *      }));
 * 
 * 
 * 
 */

Ext.define('Extend.window.EditWindow', {
            extend : 'Extend.window.FormWindow',
            alias : 'widget.EditWindow'
        })