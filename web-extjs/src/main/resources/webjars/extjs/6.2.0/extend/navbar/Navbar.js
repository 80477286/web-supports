Ext.define('Extend.navbar.Navbar', {
    extend: 'Ext.Component',
    alias: ['widget.navbar'],//组件别名，可以是多个
    baseCls: 'navbar',//基础样式类
    height: 46,
    config: {
        menuAlign: 'default', itemWidth: null, itemHeight: null
    },
    childEls: {
        body: {dataRef: 'body'}
    },
    renderTpl: [
        '<div id="{id}-body" data-ref="body" class="{baseCls}-body {baseCls}-body-align-{menuAlign}">',
        '</div>'
    ],
    initRenderData: function () {
        var data = this.callParent(arguments);
        return Ext.apply(data, {menuAlign: this.menuAlign});
    },
    onRender: function () {
        this.callParent(arguments);
        this.initItems();
        console.log(this.body)
    },
    initItems: function () {
        var view = this;
        if (!Ext.isEmpty(this.menus)) {
            try {
                for (var i = 0; i < this.menus.length; i++) {
                    var menu = this.menus[i];
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
                        ne.applyStyles({width: view.itemHeight})
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
                    if (Ext.isEmpty(href) && !Ext.isEmpty(handler) && Ext.isFunction(handler)) {
                        ne.on({
                            click: handler, scope: ne, args: [ne, menu]
                        })
                    }
                    if (!Ext.isEmpty(href)) {
                        ne.setHtml()
                        var a = Ext.dom.Helper.append(ne, {tag: 'a', html: menu.name}, true)
                        a.set({href: href, target: menu.target});
                        if (ne.menu.logo == true) {
                            ne.on({
                                click: function (_menu) {
                                    if (_menu.target == '_blank') {
                                        window.open(_menu.href)
                                    } else {
                                        window.location.href = _menu.href
                                    }
                                }, scope: ne, args: [ne, menu]
                            });
                        }
                    }
                    ne.on({
                        click: function (menu) {
                            view.fireEvent('itemclick', menu)
                        }, scope: ne, args: [ne, menu]
                    });
                    if (menu.logo != true) {
                        ne.on({
                            mouseenter: function () {
                                this.addCls('ux-menu-over')
                            },
                            mouseleave: function () {
                                this.removeCls('ux-menu-over')
                            }, scope: ne, args: [menu]
                        });
                    }
                }
            }
            catch
                (e) {
                console.log({level: 'error', msg: 'failed to create menus!'});
            }
        }
    },
    initEvents: function () {
        this.callParent(arguments);
    }
})