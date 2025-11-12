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
		this.on('all', e => console.log('->', e))
	},
	childViewOptions() {
		return {
			schemaData: this.schemaData,
			valueSchema: this.model
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
	}
});

export const PropertyView = View.extend({
	stateClassNames: ['required','invalid'],
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
			model: this.model
		}
	},
	children() {
		const views = [PropertyValueView];
		if (!this.model.isNoLabel()) {
			views.unshift(PropertyLabelView);
		}
		return views;
	},
	childViewEvents: {
		'before:validate':'_onBeforeValidate',
		'validate':'_onValidate',
	},
	async _onValidate(resPromise) {
		const res = await resPromise;
		console.log('prop validate', res)
	}

});

function toCssClass(text) {
	return text.replace(/\./gmi, '_');
}