Ext.application({
    name: 'App',
    appFolder: 'app',
    autoCreateViewport: 'App.main.view.Viewport',
    login: function (preOpts) {
        if (!Ext.getCmp('login_window')) {
            Ext.create('App.authorization.user.view.LoginWindow', {
                preOpts: preOpts,
                id: 'login_window'
            }).show();
        }
    },
    requires: ['App.components.grid.column.CdtColumn'],
    logout: function () {
        var me = this;
        Extend.Msg.confirm({
            title: '确认',
            msg: '您确定要注销当前用户吗？',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            iconCls: 'lock_key',
            maxWidth: 1024,
            callback: function (opt) {
                if (opt === 'yes') {
                    Ext.Ajax.request({
                        url: 'logout',
                        success: function (resp) {
                            me
                                .getMainView()
                                .down('North')
                                .fireEvent("onLogoutSuccess")
                            me.checkAuthorities();
                        }
                    });
                }
            }
        });
    },
    init: function (application) {
        Ext.log.info('development:true');
        Ext.log.info('context:' + context);
        Ext.log.info('libsPath:' + libsPath);
        Ext.log.info('extjsPath:' + extjsPath);
        Ext.log.info('extendPath:' + extendPath);
        Ext.log.info('theme:' + theme);
        window.app = window.App = window.Application = window.application = application;

        window.app.optsQueue = [];
        Ext.Ajax.disableCachingParam = 'dc';

        this.custominit();
        this.checkBrowser();
        // 配置Ajax请求事件处理函数
        Ext.Ajax.on({
            beforerequest: function (conn, options, eOpts) {
                var timeout = options.timeout;
                if (timeout <= 30 * 1000) {
                    timeout = 120 * 1000;
                }

                if (Ext.isEmpty(options.url)) {
                    Extend.Msg.error('错误', '没有提供操作接口URL无法完成操作请求，请配置后重试！')
                    return;
                }
                // 配置全局请求参数
                Ext.apply(options, {
                    timeout: timeout,
                    method: "POST",
                    url: options.url.replace(/_dc=/, 'dc='),
                    defaultHeaders: {
                        'request_type': 'ajax'
                    }
                })
                Ext.log({
                    level: 'info',
                    msg: 'Request:' + options.url,
                    dump: options
                });
            },
            requestcomplete: function (conn, resp, options, eOpts) {
                Ext.log({
                    level: 'info',
                    msg: 'Response:' + options.url,
                    dump: resp
                });
                // 取得此次请求的url地址
                var url = options.url;
                if (!Ext.String.startsWith(url, 'http')) {
                    url = window.location.href.substring(0,
                        window.location.href.lastIndexOf('/') + 1)
                        + url;
                }
                var text = resp.responseText;
                text = Ext.String.trim(text);
                // 判断是否是json字符串格式
                if ((Ext.String.startsWith(text, '{') && Ext.String.endsWith(
                        text, '\}'))
                    || (Ext.String.startsWith(text, '[') && Ext.String
                        .endsWith(text, ']'))) {
                    try {
                        resp.result = Ext.decode(text);
                    } catch (e) {
                        var error = '返回数据不是合法的JSON格式!';
                        Extend.Msg.error('错误', error, {
                            '返回数据': text
                        });
                        return;
                    }
                    if (!Ext.isEmpty(resp.result)) {
                        if (resp.result.success === false) {
                            if (!Ext.isEmpty(resp.result.status)) {
                                // 如果状态为-1表达未登录，2表示登录失败，1表示登录成功,3表示无权限访问
                                if (resp.result.status === -1) {
                                    application.login(options);
                                } else if (resp.result.status === 3) {
                                    Extend.Msg.error('错误', resp.result.result);
                                }
                                return;
                            }
                            if (isDebug) {
                                var error = resp.result.result
                                    ? resp.result.result
                                    : (resp.result.exception
                                        ? '业务处理发生异常！'
                                        : '业务处理失败：处理结果"success"为"false"！');
                                Extend.Msg.error("错误", resp.result.result,
                                    resp.result.messages,
                                    resp.result.errors,
                                    resp.result.exception);
                            } else {
                                Extend.Msg.error("错误", resp.result.result,
                                    resp.result.messages,
                                    resp.result.errors);
                            }
                            return;
                        } else {
                            if (!Ext.isEmpty(resp.result.errors)) {
                                Extend.Msg.error("错误", resp.result.result
                                    || "请求发生错误：" + url,
                                    resp.result.messages,
                                    resp.result.errors);
                            }
                        }

                    }
                } else if (text.indexOf("<html>") > -1) {
                    var responseText = null;
                    if (isDebug === true) {
                        responseText = text;
                    }
                    if (text.indexOf("There is no Action mapped for namespace") > -1) {
                        var error = '请求的Action不存在:' + url;
                        Extend.Msg.error("错误", error, responseText);
                        var result = "{\"success\":false,\"result\":\"" + error
                            + "\"}";
                        resp.responseText = result;
                        resp.result = Ext.decode(result);
                    } else if (text.indexOf('Struts Problem Report') > -1) {
                        var error = '请求的Action发生异常:' + url;
                        Extend.Msg.error("错误", error, responseText);
                        var result = '{"success":false,"exception":"'
                            + responseText + '","result":"' + error + '"}';
                        resp.responseText = result;
                        resp.result = Ext.decode(result);
                    }
                }
            },
            requestexception: function (conn, resp, options, eOpts) {
                Ext.log({
                    level: 'error',
                    msg: 'Response:' + options.url,
                    dump: resp
                });
                var status = resp.status;
                var detail = null;
                var url = options.url;
                if (!Ext.String.startsWith(url, 'http')) {
                    url = window.location.href.substring(0,
                        window.location.href.lastIndexOf('/') + 1)
                        + url;
                }
                if (isDebug) {
                    detail = {
                        "Status code:": resp.status,
                        "Status text:": resp.statusText
                    };
                    if (!Ext.isEmpty(resp.responseText)) {
                        detail['Detail:'] = resp.responseText;
                    }
                }
                if (status === 0 && resp.timedout === true) {
                    var error = '请求超时：' + url;
                    Extend.Msg.error('错误(status=' + status + ')', error);
                } else if (status === 404) {
                    var error = '请求地址未找到：' + url;
                    Extend.Msg
                        .error('错误(status=' + status + ')', error, detail);
                } else if (status === -1) {
                    var error = '请求终止：' + url;
                    Ext.log.warn(error);
                } else {
                    var error = '请求发生错误:' + url;
                    Extend.Msg
                        .error('错误(status=' + status + ')', error, detail);
                }
            }
        });
        Ext.Ajax.request({
            url: 'get_localhost',
            success: function (resp) {
                // var result = resp.result;
                // app.localhost = result.host;
                // Ext.log({
                //     level: 'info',
                //     msg: app.localhost
                // })
            }
        });
        window.onbeforeunload = function () {
            if (!Ext.Object.isEmpty(app.editors)) {
                return "存在编辑中的数据还没有保存，是否要离开此页面？";
            }
            return null;
        }
    },
    checkBrowser: function () {
        if ((Ext.browser.name == 'Chrome' && Ext.browser.version.major < 42)
            || (Ext.browser.name == 'IE' && Ext.browser.version.major < 10)) {
            Extend.Msg
                .warn(
                    '提示',
                    '为了更好的用户体验，建议浏览器版本：Google chrome 42.xxx及以上版本、IE10及以上版本。<br/><br/>'
                    + '<span>Google Chrome：<a style="color:blue;" href="software/ChromeStandalone_49.0.2623.110_Setup.1459233395.exe">ChromeStandalone_49.0.2623.110_Setup.1459233395</a></span><br/>'
                    + 'Internet Explorer 11 32位：<a  style="color:blue;" href="software/Internet Explorer11_ ForWin7_32bit_201610.exe">Internet Explorer 11 for Win7_32bit</a><br/>'
                    + 'Internet Explorer 11 64位：<a  style="color:blue;" href="software/Internet Explorer11_ ForWin7_64bit_201610.exe">Internet Explorer 11 for Win7_64bit</a>');
        }
    },
    checkAuthorities: function (view) {
        var mainView = this.getMainView();
        var target = view || mainView;
        var list = target.query('component[security="true"]');
        if (Ext.isEmpty(list) || list.length == 0) {
            return;
        }
        if (Ext.isEmpty(this.user) || Ext.isEmpty(app.user.resources)) {
            Ext.Array.each(list, function (item) {
                item.hide();
            })
        } else {
            Ext.Array.each(list, function (item) {
                var uiid = item.uiid;
                var authorities = Ext.Array.findBy(app.user.resources,
                    function (resource) {
                        if (!Ext.isEmpty(uiid.match(resource.uiid))) {
                            return item;
                        }
                    })
                if (Ext.isEmpty(authorities)) {
                    item.hide();
                } else {
                    item.show();
                }
            })
        }
    }, custominit: function () {
        window.onkeydown = function (e) {
            if (event.keyCode == 8) {
                if (e.target.nodeName != "INPUT" && e.target.nodeName != "TEXTAREA"
                    && e.target.className != "dotitem") {
                    if (app.app.optsQueue.length > 1) {
                        var lastIndex = app.app.optsQueue.length - 2;
                        var item = app.app.optsQueue[lastIndex];
                        Ext.Array.removeAt(app.app.optsQueue, lastIndex, 10);
                        app.app._mainView.down('North').fireEvent('menuclick',
                            item.clazz, item.options)
                    }
                    console.log(app.app._mainView)
                    if (Ext.isFunction(e.stopEvent)) {
                        e.stopEvent();
                    }
                    if (Ext.isFunction(e.preventDefault)) {
                        e.preventDefault();
                    }
                }
            }
        };

        Ext.override(Ext.grid.plugin.RowEditing, {
            onCellClick: function (view, cell, colIdx, record, row, rowIdx, e) {
                if (this.clicksToEdit === false || this.clicksToMoveEditor === false) {
                    return;
                }
                // Make sure that the column has an editor. In the case of
                // CheckboxModel,
                // calling startEdit doesn't make sense when the checkbox is
                // clicked.
                // Also, cancel editing if the element that was clicked was a
                // tree expander.
                var expanderSelector = view.expanderSelector,
                    // Use getColumnManager() in this context because colIdx
                    // includes hidden columns.
                    columnHeader = view.ownerCt.getColumnManager().getHeaderAtIndex(colIdx), editor = columnHeader
                        .getEditor(record);

                if (this.shouldStartEdit(editor)
                    && (!expanderSelector || !e.getTarget(expanderSelector))) {
                    view.ownerGrid.setActionableMode(true, e.position);
                }
            }
        });

// 解决Model创建后日期字段相关8小时问题
// 重写Model日期格式转换问题
// 原数据带T，原来在处理这样的日期时会导致时间+8小时问题
// 将原数据的T替换成“ ”解决。
        Ext.override(Ext.data.field.Date, {
            convert: function (v) {
                if (!Ext.isEmpty(arguments) && Ext.isString(arguments[0])
                    && !Ext.isEmpty(arguments[0])) {
                    arguments[0] = arguments[0].replace(/T/g, ' ')
                }
                return this.callParent(arguments);
            }
        });

        Ext.override(Ext.util.Format, {
            percent: function (value, formatString) {
                var me = this;
                if (value == -987654321) {
                    return '-';
                }
                var xxx = me.number(value * 100, formatString || '0')
                    + me.percentSign;
                return xxx;
            },
            round: function (value, precision) {
                var result = Number(value);
                if (result == -987654321) {
                    return '-';
                }
                if (typeof precision === 'number') {
                    precision = Math.pow(10, precision);
                    result = Math.round(value * precision) / precision;
                } else if (precision === undefined) {
                    result = Math.round(result);
                }
                return result;
            }
        });

    }
});