Ext.define('Extend.navbar.Navbar', {
    extend: 'Ext.Component',
    alias: ['widget.navbar'],//组件别名，可以是多个
    baseCls: 'navbar',//基础样式类
    height: 46,
    config: {
        menuAlign: 'default',
        itemWidth: null,
        itemHeight: null,
        backgroundColor: '#222',

        itemColor: '#cecece',
        itemBackgroundColor: '#222',

        itemOverColor: '#FFF',
        itemOverBackgroundColor: '#535353',

        itemActivedColor: '#FFF',
        itemActivedBackgroundColor: '#747474'
    },
    childEls: {
        body: {dataRef: 'body'},
        // body1: {select: 'div[data-ref="body"]'},//使用select会返回一个数组
        // body2: {selectNode: 'div[data-ref="body"]'}//使用selectNode会返回单个节点
    },
    renderTpl: [
        '<style>',
        '.navbar-default {background-color: {backgroundColor};}',
        '.navbar-body-align-left, .navbar-body-align-default {text-align: left;}',
        '.navbar-body-align-center {text-align: center;}',
        '.navbar-body-align-right {text-align: right;}',
        '.navbar-body .ux-menu {position: relative;text-align: center;padding: 0 10px 0 10px;cursor: pointer;font-size: 14px;float: left;}',
        '.navbar-body .ux-menu a, .navbar-body .ux-menu {color: {itemColor};text-decoration: none;font-size: 18px;}',
        '.navbar-body .ux-menu-over {background-color: {itemOverBackgroundColor};}',
        '.navbar-body .ux-menu-over a, .navbar-body .ux-menu-over {color: {itemOverColor};text-decoration: none;font-size: 18px;}',
        '.navbar-body .ux-menu-actived {background-color: {itemActivedBackgroundColor};}',
        '.navbar-body .ux-menu-actived a, .navbar-body .ux-menu-actived {color: {itemActivedColor};text-decoration: none;font-size: 18px;}',
        '</style>',
        '<div id="{id}-body" data-ref="body" class="{baseCls}-body {baseCls}-body-align-{menuAlign}">',
        '</div>'
    ],
    initRenderData: function () {
        var data = this.callParent(arguments);
        return Ext.apply(data, {
            menuAlign: this.menuAlign,
            backgroundColor: this.backgroundColor,
            itemColor: this.itemColor,
            itemBackgroundColor: this.itemBackgroundColor,

            itemOverColor: this.itemOverColor,
            itemOverBackgroundColor: this.itemOverBackgroundColor,

            itemActivedColor: this.itemActivedColor,
            itemActivedBackgroundColor: this.itemActivedBackgroundColor
        });
    },
    onRender: function () {
        this.callParent(arguments);
        this.initItems();
    },
    initItems: function () {
        var view = this;
        view.items = new Ext.util.MixedCollection();
        if (!Ext.isEmpty(this.menus)) {
            for (var i = 0; i < this.menus.length; i++) {
                var menu = this.menus[i];
                var ne = view.createMenu(menu);
                view.items.add(menu.id || menu.name, ne);
            }
        }
    },
    createMenu: function (menu) {
        try {
            var view = this;

            var spec = {tag: 'div', html: menu.name, cls: 'ux-menu'};
            var ne = Ext.dom.Helper.append(this.body, spec, true);

            var href = menu.href;
            var handler = menu.handler;
            ne.menu = menu;
            ne.applyStyles({height: this.height + 'px', lineHeight: this.height + 'px'});

            if (!Ext.isEmpty(view.itemWidth)) {
                ne.applyStyles({width: view.itemWidth})
            }
            if (!Ext.isEmpty(view.itemHeight)) {
                ne.applyStyles({height: view.itemHeight})
            }

            if (!Ext.isEmpty(menu.style)) {
                ne.applyStyles(menu.style)
            }
            if (!Ext.isEmpty(menu.icon)) {
                ne.applyStyles({
                    backgroundImage: "url('" + menu.icon + "')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: 'center center'
                });
            }
            if (!Ext.isEmpty(handler) && Ext.isFunction(handler)) {
                ne.on({
                    click: handler,
                    scope: ne,
                    args: [ne, menu]
                })
            } else {
                if (!Ext.isEmpty(href)) {
                    ne.on({
                        click: function ($ne, $menu) {
                            if ($menu.target == '_blank') {
                                window.open($menu.href);
                            } else {
                                window.location.href = $menu.href;
                            }
                        },
                        scope: ne,
                        args: [ne, menu]
                    })
                }
            }

            ne.active = function () {
                ne.updateStatus();
                view.fireEvent('itemclick', ne, menu)
            }
            ne.updateStatus = function () {
                var others = ne.parent().query('.ux-menu', false);
                if (!Ext.isEmpty(others)) {
                    Ext.Array.each(others, function (item) {
                        item.removeCls('ux-menu-actived')
                    });
                }
                ne.addCls('ux-menu-actived')
            }

            ne.on({
                click: function ($ne, $menu) {
                    view.fireEvent('itemclick', $ne, $menu)
                }, scope: ne, args: [ne, ne.menu]
            });
            if (menu.logo != true) {
                ne.on({
                    click: function (menu) {
                        ne.updateStatus();
                    }, scope: ne, args: [ne, menu]
                });
                ne.on({
                    mouseenter: function () {
                        this.addCls('ux-menu-over')
                    },
                    mouseleave: function () {
                        this.removeCls('ux-menu-over')
                    }, scope: ne, args: [menu]
                });
            }

            return ne;
        } catch (e) {
            console.log({level: 'error', msg: 'failed to create menu!'});
        }
        return null;
    }
})