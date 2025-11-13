import { detectEditControl, schemaApiViewMixin, valueSchemaApi } from '../../api/schema/index.js';
import { View } from '../../vendors.js';

const PropertyLabelView = View.extend({
	baseClassName: 'property-label',
	...schemaApiViewMixin,
	template: '<%= label %>'
});

const PropertyDisplayValueView = View.extend({
	...schemaApiViewMixin,
	initialize() {
		this.initializeSchemaData();
	},
});

const PropertyValueView = View.extend({
	...schemaApiViewMixin,
	baseClassName: 'property-value', 
	initialize() {
		this.initializeSchemaData();
	},
	childViewOptions() {
		return {
			schemaData: this.schemaData,
			valueSchema: this.model,
			editConfig: this.getOption('editConfig', true)
		}
	},
	children() {
		const views = [];
		if (this.schemaData.edit && this.schemaData.inlineEdit) {
			views.push(detectEditControl(this.model, this.schemaData));
		} else {
			views.push(PropertyDisplayValueView);
			if (this.schemaData.edit) {
				// todo: implement reset button
				const ResetButton = null;
				views.push(ResetButton);
			}
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
	children() {
		const views = [PropertyValueView];
		if (!this.model.isNoLabel()) {
			views.unshift(PropertyLabelView);
		}
		return views;
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
		//console.log('prop validate', res, ec)
		const { ignorePropertyInvalidState } = ec;
		if (ignorePropertyInvalidState === true) { return; }
		this.state('invalid', !res.ok);

		// const res = resPromise;
		// this.triggerMethod('validate', this.valueSchema.id, res);
	}

});

function toCssClass(text) {
	return text.replace(/\./gmi, '_');
}