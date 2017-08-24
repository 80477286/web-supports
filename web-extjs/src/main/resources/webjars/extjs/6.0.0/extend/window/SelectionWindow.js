/**
 * 表单窗口组件 v1.0 2015-05-23
 * 
 * <pre>
 * 配置参数
 * ---------------------------------
 *  okText : OK(选填),OK按钮显示文本
 * 	cancelText : Cancel(选填),Cancel按钮显示文本
 * 	entity : null(选填),后台接收数据的实体变量名
 * 	clientValidation(选填): true,
 * 	form : null(form与formitems选一必填),完整表单(Ext.form.Panel)配置
 * 	formitems : null(form与formitems选一必填),表单项(Ext.form.Panel.items)配置
 * 	url : null(url与submit选一必填),表单提交时的URL
 * 	submit function(form,params) : null,点击OK按钮时回调此函数，以便用户手动处理。
 * 	
 * 函数
 * ---------------------------------
 * doSubmit : function(url, params),将表单提交到指定的URL
 * isValid : function(),验证表单
 * getParams : function(),将表单转换成参数列表
 * 
 * </pre>
 */
Ext.define("Extend.window.SelectionWindow", {
            extend : "Extend.window.ModalWindow",
            alias : 'widget.selection_window',
            closeBySelected : true,
            title : '选择数据',
            iconCls : 'put',
            extraParams : {},
            initComponent : function()
            {
                this.initGrid();
                this.callParent();
            },
            initGrid : function()
            {
                var me = this;
                this._grid = null;
                if (!Ext.isEmpty(this.grid))
                {
                    if (Ext.isString(this.grid))
                    {
                        var eps = {};
                        if (!Ext.isEmpty(me.extraParams) && !Ext.Object.isEmpty(me.extraParams))
                        {
                            eps = Ext.apply({}, me.extraParams);
                        }
                        if (me.getExtraParams && Ext.isFunction(me.getExtraParams))
                        {
                            var tmp = this.getExtraParams();
                            if (tmp)
                            {
                                Ext.apply(eps, tmp);
                            }
                        }
                        this._grid = Ext.create(this.grid, {
                                    region : 'center',
                                    extraParams : eps
                                });
                    } else if (Ext.isObject(this.grid))
                    {
                        this._grid = this.grid;
                        this._grid.region = 'center';
                    }
                    if (!Ext.isEmpty(this._grid))
                    {
                        this.items = [this._grid]
                        this._grid.on({
                                    itemdblclick : function($this, record)
                                    {
                                        $this.select([record]);
                                        $this.up('window').okHandler();
                                    }
                                });
                        if (this._grid)
                        {
                            this.title = this._grid.title || this.title;
                            delete this._grid.title;
                        }
                    }
                }
            },
            okHandler : function()
            {
                var rs = this._grid.getSelectedRecords();
                if (rs.length > 0)
                {
                    this.fireEvent('selected', rs);
                    this.fireEvent('ok', rs)
                    if (this.closeBySelected === true)
                    {
                        this.close();
                    }
                }
            }
        })