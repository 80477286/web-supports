Ext.define('App.main.controller.NorthController', {
	extend : 'Ext.app.ViewController',
	alias : 'controller.NorthController',
	init : function(view) {
		var me = this;
		var vm = me.getViewModel()
		this.listen({
					component : {
						'North' : {
							afterrender : function() {
								me.loadCurrentUser();
							},
							onLoginSuccess : function(user) {
								if (Ext.isEmpty(user)) {
									vm.set('user', {
												name : '加载中...'
											});
									me.loadCurrentUser();
								}
								try {
									var center = view.up('Viewport')
											.down('Center')
									var grids = center.query('grid')
									if (grids && grids.length > 0) {
										Ext.Array.each(grids, function(grid) {
													grid.getStore().reload();
												})
									}
									grids = center.query('treepanel')
									if (grids && grids.length > 0) {
										Ext.Array.each(grids, function(grid) {
													grid.getStore().reload();
												})
									}
								} catch (e) {
									Ext.log({
												msg : '登录后刷新表格出错',
												level : 'info',
												stack : e
											})
								}
							},
							onLogoutSuccess : function() {
								vm.set('user', null);
								app.user = null;
							}
						},
						'displayfield[name=user_name]' : {
							afterrender : function($this, eOpts) {
								Ext.fly($this.el).on('click', function(e, t) {
											if (e.target.localName == 'div') {
												me
														.showVersionSelectionWindow(t);
											}
										});
							}
						}
					}
				});

		vm.bind('{user}', function(val) {
			if (Ext.isEmpty(val)) {
				vm.set('user', {
					name : '未<a href="javascript:window.app.login();">登录</a>',
					projectName : '<span style="color:rgb(255,153,51);cursor: pointer;">选择项目</span>'
				});
			} else if (!Ext.isEmpty(val.name) && val.name.indexOf('登录') == -1
					&& val.name.indexOf('加载中') == -1) {
				val.name = val.name = '<span style="color:rgb(255,153,51);cursor: pointer;">'
						+ val.name
						+ '</span>'
						+ '&nbsp;&nbsp;<a href="javascript:window.app.logout();">注销</a>'

				// 用户登录后给主tab切换事件加上用户基本信息检查，如果不通过就弹出配置窗口
				var center = view.up('Viewport').down('Center');
				center.on('tabchange', function() {
							var user = app.user;
							if (!Ext.isEmpty(user)
									&& (Ext.isEmpty(user.w3Username))) {
								me.showVersionSelectionWindow();
							}
						});
				if (Ext.isEmpty(val.w3Username)) {
					me.showVersionSelectionWindow();
				}
				vm.set('user', val);
			}
		})
	},
	showVersionSelectionWindow : function(target) {
		var user = window.app.user;
		if (user.id) {
			var win = Ext.create('App.user.config.view.ConfigWindow', {});
			win.show();
		} else {
			app.login();
		}
	},
	loadCurrentUser : function() {
		var me = this;
		var view = me.getView();
		Ext.Ajax.request({
					url : 'get_current_user',
					success : function(resp) {
						console.log(resp)
						// if (resp.result.success === true
						// 		&& !Ext.isEmpty(resp.result.data)) {
						// 	me.getViewModel().set('user', resp.result.data);
						// 	app.user = resp.result.data;
						// 	view.fireEvent('loadcurrentuser', app.user);
						// 	app.checkAuthorities();
						// 	var theme = app.user.theme;
						// 	if (!Ext.isEmpty(theme)) {
						// 		var oldTheme = Ext.util.Cookies
						// 				.get('rfmp_theme');
                        //
						// 		var exdate = new Date()
						// 		exdate.setDate(exdate.getDate() + 360)
						// 		Ext.util.Cookies.set('rfmp_theme', theme,
						// 				exdate)
						// 		if (theme != oldTheme) {
						// 			Extend.Msg.confirm('提示',
						// 					'您喜欢的皮肤设置成功，是否新重新刷新页面以加载新皮肤', null,
						// 					function(opt) {
						// 						if (opt == 'yes') {
						// 							location.reload();
						// 						}
						// 					})
						// 		}
						// 	} else {
						// 		Ext.util.Cookies.set('rfmp_theme', 'neptune')
						// 	}
						// } else {
						// 	me.getViewModel().set('user', null);
						// 	app.user = null;
						// }

					}
				});
	}
})