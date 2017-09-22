(function () {
    window.libsPath = 'webjars/';
    window.extjsPath = libsPath + 'extjs/6.2.0/build/';
    window.extendPath = libsPath + 'extjs/6.2.0/extend/';
    window.isDebug = false;
    window.theme = null;

    var Cookie = new Object();
    Cookie.get = function (name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(name + "=")
            if (c_start != -1) {
                c_start = c_start + name.length + 1
                c_end = document.cookie.indexOf(";", c_start)
                if (c_end == -1)
                    c_end = document.cookie.length
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return ""
    }
    Cookie.set = function (name, value, expiredays, path, domain) {
        var exdate = new Date()
        exdate.setDate(exdate.getDate() + expiredays)
        document.cookie = name + "=" + escape(value)
            + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + (path ? ";path=" + path : "")
            + (domain ? ";domain=" + domain : "")
    }

    // 判断是否是高度模式
    if (window.location.search.match('(\\?|&)debug') !== null) {
        isDebug = true;
    } else if (isDebug === null && window.location.protocol === 'file:') {
        isDebug = true;
    } else {
        var localhostTests = [/^localhost$/, /^127.0.0.1$/];
        for (var i = 0; i < localhostTests.length; i++) {
            test = localhostTests[i];
            if (window.location.hostname.search(test) !== -1) {
                isDebug = true;
                break;
            }
        }
    }

    // 读取当前theme，如果没有则默认为neptune
    theme = Cookie.get("extjs_theme");
    if (!theme) {
        theme = "neptune";
    }
    // 引用Extjs库
    document.write('<link rel="stylesheet" href="' + extjsPath + 'classic/theme-' + theme + '/resources/theme-' + theme
        + '-all' + '.css"></link>');
    document.write('<link rel="stylesheet" href="' + extjsPath + 'packages/ux/classic/' + theme + '/resources/ux-all'
        + '.css"></link>');
    document.write('<link rel="stylesheet" href="' + extendPath + '../no_box_shadow.css"></link>');
    document.write('<script type="text/javascript" charset="UTF-8" src="' + extjsPath + 'ext-all'
        + (isDebug ? '-debug' : '') + '.js"></script>');
    document.write('<script type="text/javascript" charset="UTF-8" src="' + extjsPath + 'classic/theme-' + theme
        + '/theme-' + theme + (isDebug ? '-debug' : '') + '.js"></script>');
    // document.write('<script type="text/javascript" charset="UTF-8" src="' + extjsPath + 'packages/ux/classic/ux'
    //     + (isDebug ? '-debug' : '') + '.js"></script>');
    document.write('<script type="text/javascript" charset="UTF-8" src="' + extjsPath + 'classic/locale/locale-zh_CN'
        + (isDebug ? '-debug' : '') + '.js"></script>');
    document.write('<script type="text/javascript" charset="UTF-8" src="' + extendPath + '../init.js"></script>');
})();
