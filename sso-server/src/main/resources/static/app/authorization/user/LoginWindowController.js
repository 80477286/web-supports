Ext.define('App.authorization.user.LoginWindowController', {
	extend : 'Ext.app.ViewController',
	alias : 'controller.login_window_controller',
	init : function(view) {
		var me = this;
		this.control({
					'login_window' : {
						loginSuccess : function(result) {
							// 登录成功
							// 后，手动触发North的onLoginSuccess事件，使其重新加载用户信息
							var viewport = window.application.getMainView();
							viewport.down('North').fireEvent('onLoginSuccess');
						}
					},
					'button[action=login]' : {
						click : 'loginHandler'
					},
					'button[action=cancel]' : {
						click : 'closeHandler'
					},
					'textfield' : {
						change : function() {
							view.down("label[name='errors']").setText("");
						}
					},
					'textfield[name="username"]' : {
						keypress : function($this, e, eOpts) {
							if (e.keyCode === 13) {
								this.getView()
										.down('textfield[name="password"]')
										.focus();
							}
						}
					},
					'textfield[name="password"]' : {
						keypress : function($this, e, eOpts) {
							if (e.keyCode === 13) {
								me.loginHandler();
							}
						}
					}
				})
	},
	closeHandler : function() {
		this.getView().close();
	},
	loginHandler : function() {
		var me = this;
		var view = this.getView();
		var form = view.formPanel.getForm();
		if (form.isValid()) {
			var opts = {
				success : 'submitSuccessHandler',
				failure : 'submitFailureHandler',
				submitEmptyText : false,
				scope : me
			};
			view.getEl().mask(view.submitText);
			form.submit(opts);
		}
	},
	submitSuccessHandler : function(form, action) {
		try {
			var view = this.getView();
			if (action.result.status == 1) {
				var opts = view.preOpts;
				try {
					if (opts.defaultHeaders.request_type === 'ajax') {
						if (Ext.isEmpty(opts.scope)) {
							Ext.Ajax.request(opts);
						} else if (opts.scope instanceof Ext.form.action.Action) {
							Ext.Ajax.request(opts);
						}
						// else if (opts.scope instanceof
						// Ext.data.proxy.Proxy)
						// {
						// opts.getProxy().read(opts);
						// }
					}

				} catch (e) {
				}

				view.fireEvent('loginSuccess', action.result);
				view.close();
			} else if (action.result.status == 2) {
				var label = view.down("label[name='errors']");
				view.getEl().unmask();
				label.setText("登录失败：" + action.result.result);
			} else {
				label.setText('登录出现异常:STATUS=' + action.result.status);
				view.getEl().unmask();
			}
		} catch (e) {
			throw e;
		}
	},
	submitFailureHandler : function(form, action) {
		var view = this.getView();
		try {
			var label = view.down("label[name='errors']");
			view.getEl().unmask();
			label.setText("登录失败：" + action.result.result);
			view.fireEvent('loginFailure', action.result);
		} finally {
			view.getEl().unmask();
		}
	}
});
