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
	childViewOptions() {
		return {
			schemaData: this.schemaData,
			groupName: this.getOption('header', true),
			editConfig: this.getOption('editConfig', true)
		}
	},
});