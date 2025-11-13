import { View } from '../../../vendors.js';
import { PropertiesGroupView } from '../../properties/PropertiesGroupView.js';
import { SubmitFormContainerView, formViewMixin } from '../common/index.js';

export const SimpleFormView = View.extend({
	baseClassName: 'form-layout',
	children: [
		PropertiesGroupView,
		SubmitFormContainerView
	],
	...formViewMixin,
	initialize() {
		this.initializeForm();
	},
	formButtonsOptions() {
		const options = this.getOptions(['submitButton', 'cancelButton', 'rightButton'], true);
		
		return options;
	},
	childViewOptions() {
		return {
			schemaData: this.schemaData,
			groupName: this.getOption('header', true),
			editConfig: this.getOption('editConfig', true)
		}
	},
	childViewEvents: {
		'property:validate'(path, validateResult) {
			console.warn(path, validateResult);
		}
	}
});