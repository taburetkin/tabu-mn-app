import { modals } from '../../api/index.js';
import { detectEditControl, schemaApiViewMixin, valueSchemaApi } from '../../api/schema/index.js';
import { View } from '../../vendors.js';
import { SingleFormView } from '../forms/single/index.js';

const PropertyLabelView = View.extend({
	baseClassName: 'property-label',
	...schemaApiViewMixin,
	template: '<%= label %>'
});

const PropertyDisplayValueView = View.extend({
	...schemaApiViewMixin,
	baseClassName: [
		'display-property-value',
		v => v.cssEditable()

	],
	initialize() {
		this.initializeSchemaData();
		this.initializeEditInModal();
	},
	initializeEditInModal() {
		if (!this.isModalEdit()) {
			return;
		}
		this.delegate('click', () => this._editInModal())
	},
	_editInModal() {
		let controlView = this.getOption('modalEditControl', true);
		const schemaData = this.schemaData;
		const valueSchema = this.valueSchema;
		let submitButton = 'Применить';
		let cancelButton = 'Отмена';
		let rightButton = 'Сбросить';
		const view = { class: SingleFormView, controlView, schemaData, valueSchema, submitButton, cancelButton, rightButton }
		const modal = {
			headerText: this.schemaGet('label'),
		}
		modals.show(view, modal)
	},
	isModalEdit() {
		const editable = this.schemaData.edit && !this.schemaData.inlineEdit;
		return editable;
	},
	cssEditable() {
		const editable = this.isModalEdit();
		return editable ? 'editable' : ''
	},
	template: '<%= displayValue %>',
	templateContext() {
		return {
			displayValue: this.schemaDisplay() || '<i>empty</i>'
		}
	}
});

export const PropertyValueView = View.extend({
	...schemaApiViewMixin,
	baseClassName: 'property-value', 
	initialize() {
		this.initializeSchemaData();
	},
	childViewOptions() {
		return {
			schemaData: this.schemaData,
			valueSchema: this.model,
			editConfig: this.getOption('editConfig', true),
			model: this.model,
		}
	},
	detectEditControl(options) {
		const control = detectEditControl(this.model, this.schemaData, options);
		return control;
	},
	_getEditControl() {
		if (!this.schemaData.edit || !this.schemaData.inlineEdit) return;
		const control = this.detectEditControl({ inline: true });
		return control;
	},
	children() {
		const prefix = this.getOption('prefixValueView', true);
		const views = [prefix];
		const postfix = this.getOption('postfixValueView', true);
		const control = this._getEditControl();
		if (control) {
			views.push(control);
			//views.push(postfix);
		} else {
			const modalEditControl = this.detectEditControl();
			views.push({ class: PropertyDisplayValueView, modalEditControl });
		}
		views.push(postfix);
		if (this.schemaData.edit) {
			// todo: implement reset button
			const ResetButton = null;
			views.push(ResetButton);
		}
		return views;
	}, 
	childViewTriggers: {
		'before:validate':'before:validate',
		'validate':'validate',
		'user:input':'user:input',
	}
});

export const PropertyView = View.extend({
	stateClassNames: ['required','invalid', 'changed', 'has-value'],
	baseClassName: [
		'property-container',
		v => toCssClass(valueSchemaApi.inputName(v.valueSchema, v.schemaData))
	],
	...schemaApiViewMixin,
	initialize() {
		this.initializeSchemaData();
	},
	childViewOptions() {
		return {
			schemaData: this.schemaData,
			model: this.model,
			editConfig: this.getOption('editConfig', true)
		}
	},
	hasChildren: true,
	ValueView: PropertyValueView,
	getValueView() {
		return this.getOption('ValueView', true);
	},
	LabelView: PropertyLabelView,
	getLabelView() {
		if(this.model.isNoLabel()) {
			return;
		}
		return this.getOption('LabelView', true);
	},
	getChildren() {
		const valueView = this.getValueView();
		const labelView = this.getLabelView();
		const views = [labelView, valueView];
		return views; 
		//[PropertyValueView];
		// if (!this.model.isNoLabel()) {
		// 	views.unshift(PropertyLabelView);
		// }
		// return views;
	},
	childViewTriggers: {
		'user:input': 'user:input'
	},
	childViewEvents: {
		'validate':'_onValidate',
	},
	_onValidate(res, { isInitial } = {}) {
		const ec = this.getOption('editConfig', true) || {};
		if (!isInitial) {
			this.triggerMethod('validate', this.valueSchema.id, res);
		}

		const { ignorePropertyInvalidState } = ec;
		if (ignorePropertyInvalidState === true) { return; }
		this.state('invalid', !res.ok);

	}

});

function toCssClass(text) {
	if (!text) return text;
	return text.replace(/\./gmi, '_');
}