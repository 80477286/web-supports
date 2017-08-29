Ext.define('Extend.form.field.MonthField', {
			extend : 'Ext.form.field.Date',
			alias : ['widget.monthfield', 'widget.MonthField'],
			requires : ['Ext.picker.Month'],
			alternateClassName : ['Ext.form.MonthField', 'Ext.form.Month'],
			format : 'Ym',
			createPicker : function() {
				var me = this, format = Ext.String.format, pickerConfig;

				pickerConfig = {
					pickerField : me,
					ownerCmp : me,
					floating : true,
					hidden : true,
					focusOnShow : true,
					minDate : me.minValue,
					maxDate : me.maxValue,
					disabledDatesRE : me.disabledDatesRE,
					disabledDatesText : me.disabledDatesText,
					disabledDays : me.disabledDays,
					disabledDaysText : me.disabledDaysText,
					format : me.format,
					showToday : me.showToday,
					startDay : me.startDay,
					minText : format(me.minText, me.formatDate(me.minValue)),
					maxText : format(me.maxText, me.formatDate(me.maxValue)),
					listeners : {
						select : {
							scope : me,
							fn : me.onSelect
						},
						OkClick : {
							scope : me,
							fn : me.onOKClick
						},
						CancelClick : {
							scope : me,
							fn : me.onCancelClick
						}
					},
					keyNavConfig : {
						esc : function() {
							me.collapse();
						}
					}
				};

				if (Ext.isChrome) {
					me.originalCollapse = me.collapse;
					pickerConfig.listeners.boxready = {
						fn : function() {
							this.picker.el.on({
										mousedown : function() {
											this.collapse = Ext.emptyFn;
										},
										mouseup : function() {
											this.collapse = this.originalCollapse;
										},
										scope : this
									});
						},
						scope : me,
						single : true
					}
				}

				return Ext.create('Ext.picker.Month', pickerConfig);
			},
			onOKClick : function() {
				var me = this;
				me.picker.fireEvent('select', me.picker, me.picker.getValue());
				me.collapse();
			},
			onCancelClick : function() {
				var me = this;
				me.collapse();
			},
			onSelect : function(m, d) {
				var me = this;
				var dt = new Date(d[1], d[0], 1);
				me.setValue(dt);
				me.fireEvent('select', me, dt);
				me.inputEl.focus();
				me.collapse();
			},
			onExpand : function() {

				var value = this.getValue();
				if (!Ext.isDate(value)) {
					value = new Date();
				}
				var month = value.getMonth();
				var year = value.getFullYear();

				this.picker.setValue([month, year]);
			}
		})