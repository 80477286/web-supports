Ext.define('Extend.tree.HalfSelection', {
    extend : 'Ext.AbstractPlugin',
    alias : 'plugin.HalfSelection',
    grid : null,
    // 用于更新treecolumn列的tpl，以便支持半选
    config : {
        cellTpl : [
                '<tpl for="lines">',
                '<div class="{parent.childCls} {parent.elbowCls}-img ',
                '{parent.elbowCls}-<tpl if=".">line<tpl else>empty</tpl>" role="presentation"></div>',
                '</tpl>',
                '<div class="{childCls} {elbowCls}-img {elbowCls}',
                '<tpl if="isLast">-end</tpl><tpl if="expandable">-plus {expanderCls}</tpl>" role="presentation"></div>',
                '<tpl if="checked !== null">',
                '<div role="button" {ariaCellCheckboxAttr}',
                ' class="{childCls} {checkboxCls}<tpl if="checked==true"> {checkboxCls}-checked<tpl else><tpl if="checked==\'half\'"> {checkboxCls}-half</tpl></tpl>"></div>',
                '</tpl>',
                '<tpl if="icon"><img src="{blankUrl}"<tpl else><div</tpl>',
                ' role="presentation" class="{childCls} {baseIconCls} {customIconCls} ',
                '{baseIconCls}-<tpl if="leaf">leaf<tpl else><tpl if="expanded">parent-expanded<tpl else>parent</tpl></tpl> {iconCls}" ',
                '<tpl if="icon">style="background-image:url({icon})"/><tpl else>></div></tpl>', '<tpl if="href">',
                '<a href="{href}" role="link" target="{hrefTarget}" class="{textCls} {childCls}">{value}</a>',
                '<tpl else>', '<span class="{textCls} {childCls}">{value}</span>', '</tpl>']
    },
    init : function(grid)
    {
        var me = this;
        me.grid = grid;

        // 替换Ext.tree.View中的cellTpl，在其中增加了半选状态的支持的相关代码:<tpl else><tpl if="half">
        // {checkboxCls}-half</tpl>
        me.grid.getColumns()[0].cellTpl = me.cellTpl;

        me.grid.getView().onCheckChange = me.onCheckChange;
        me.grid.on({
                    checkchange : me.onCheckchange,
                    load : me.onLoad,
                    scope : me
                });
        this.grid.getCheckedNodes = me.getCheckedNodes;

        me.enabledCheckFields = me.grid.enabledCheckFields || {};
        me.disabledCheckFields = me.grid.disabledCheckFields || {};
    },
    onCheckchange : function(node, checked, eOpts)
    {
        var me = this;
        me.udpateChildCheckbox(node, checked);
        me.updateParentCheckbox(node);
    },
    onLoad : function($this, records, successful, operation, node, eOpts)
    {
        var me = this;
        if (Ext.Object.isEmpty(me.enabledCheckFields) && Ext.Object.isEmpty(me.disabledCheckFields))
        {
            return;
        }
        if (!Ext.Object.isEmpty(me.disabledCheckFields))
        {
            for (var i = 0; i < records.length; i++)
            {
                var record = records[i];
                // 判断节点是否是禁用Checkbox的，如果是checked=null,否则checked=false
                var checked = false;
                for (key in me.disabledCheckFields)
                {
                    var values = me.disabledCheckFields[key];
                    if (!Ext.isArray(values))
                    {
                        values = [me.disabledCheckFields[key]];
                    }
                    if (Ext.Array.contains(values, record.get(key)))
                    {
                        checked = null;
                        break;
                    }
                }
                // 判断父节点是否是禁止勾选的
                if (checked != null && (me.getParentNodeStatus(node) === true || record.get('checked') === true))
                {
                    checked = true;
                }
                record.set('checked', checked);
            }
        } else
        {
            for (var i = 0; i < records.length; i++)
            {
                var record = records[i];
                var checked = record.get('checked');
                if (checked == null)
                {
                    for (key in me.checkFields)
                    {
                        var values = me.checkFields[key];
                        if (!Ext.isArray(values))
                        {
                            values = [me.checkFields[key]];
                        }
                        if (Ext.Array.contains(values, record.get(key)))
                        {
                            record.set('checked', false);
                            break;
                        } else
                        {
                            record.set('checked', null);
                            break;
                        }
                    }
                }
            }
        }
    },
    getParentNodeStatus : function(node)
    {
        var me = this;
        if (node.get('checked') != null)
        {
            return node.get('checked');
        } else if (!Ext.isEmpty(node.parentNode))
        {
            return me.getParentNodeStatus(node.parentNode);
        }
    },
    getCheckedNodes : function(node)
    {
        var me = this;
        var nodes = [];
        if (Ext.isEmpty(node))
        {
            node = this.grid.getStore().getRoot();
        }

        if (node.isRoot())
        {
            if (node.isLoaded() && node.isLeaf() !== true)
            {
                for (var i = 0; i < node.childNodes.length; i++)
                {
                    var item = node.childNodes[i];
                    var tmp = me.getCheckedNodes(item);
                    Ext.Array.insert(nodes, nodes.length, tmp);
                }
            }
        } else
        {
            if (node.get('checked') === true)
            {
                nodes.push(node);
            } else if (node.isLoaded() && node.isLeaf() !== true)
            {
                for (var i = 0; i < node.childNodes.length; i++)
                {
                    var item = node.childNodes[i];
                    var tmp = me.getCheckedNodes(item);
                    Ext.Array.insert(nodes, nodes.length, tmp);
                }
            }
        }
        return nodes;
    },
    updateParentCheckbox : function(node)
    {
        var me = this;
        var parentNode = node.parentNode;
        if (!parentNode.isRoot())
        {
            if (parentNode.get('checked') != null)
            {
                var status = me.getChildCheckedStatus(parentNode)
                parentNode.set('checked', status);
            }
            me.updateParentCheckbox(parentNode);
        }

    },
    udpateChildCheckbox : function(node, checked)
    {
        var me = this;
        if (Ext.isBoolean(checked))
        {
            if (checked === true)
            {
                Ext.Array.each(node.childNodes, function(item)
                        {
                            if (item.get('checked') != null)
                            {
                                item.set('checked', true);
                            }
                            me.udpateChildCheckbox(item, checked);
                        });
            } else if (checked === false)
            {
                Ext.Array.each(node.childNodes, function(item)
                        {
                            if (item.get('checked') != null)
                            {
                                item.set('checked', false);
                            }
                            me.udpateChildCheckbox(item, checked);
                        });
                if (node.get('checked') != null)
                {
                    node.set('checked', false);
                }
            } else
            {
                Ext.Array.each(node.childNodes, function(item)
                        {
                            me.udpateChildCheckbox(item, checked);
                        });
            }
        }
    },
    getChildCheckedStatus : function(node)
    {
        var nochecked = 0, checked = 0;
        for (var i = 0; i < node.childNodes.length; i++)
        {
            var item = node.childNodes[i];
            if (item.get('checked') === 'half')
            {
                return 'half';
            }
            if (item.get('checked') === true)
            {
                checked += 1;
            } else
            {
                nochecked += 1;
            }
            if (nochecked > 0 && checked > 0)
            {
                return 'half';
            }
        }
        if (checked > 0 && nochecked == 0)
        {
            return true;
        }
        return false;
    },
    onCheckChange : function(record)
    {
        var checked = record.get('checked');
        if (Ext.isBoolean(checked) || checked == 'half')
        {
            checked = !checked;
            record.set('checked', checked);
            this.fireEvent('checkchange', record, checked);
        }
    }
})