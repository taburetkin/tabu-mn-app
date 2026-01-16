import { View } from '../../../vendors.js';
import { PropertiesGroupView } from '../../properties/PropertiesGroupView.js';
import { SubmitFormContainerView, formViewMixin } from '../common/index.js';

export const SingleFormView = View.extend({
	baseClassName: 'form-layout',
	tagName: 'form',
	children: [
		v => v.getControlView(),
		SubmitFormContainerView
	],
	...formViewMixin,
	initialize() {
		this.initializeForm();
	},
	getControlView() {
		return this.getOption('controlView', true);
	},
	childViewOptions() {
		return {
			schemaData: this.schemaData,
			valueSchema: this.valueSchema,
			editConfig: this.getOption('editConfig', true)
		}
	},
	formButtonsOptions() {
		const opts = this.getOptions(['submitButton', 'cancelButton', 'rightButton'], true);
		return opts;
	}
});