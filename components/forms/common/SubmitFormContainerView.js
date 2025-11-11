import { ButtonView } from '../../../ButtonView.js';
import { View } from '../../../vendors.js';

export const SubmitFormContainerView = View.extend({
	baseClassName: 'submit-form-container',
	childView: ButtonView
});