import { ButtonView } from '../../../ButtonView.js';
import { View } from '../../../vendors.js';

export const SubmitFormContainerView = View.extend({
	name: 'submitFormContainerView',
	baseClassName: 'submit-form-container',
	childView: ButtonView,
	children() {
		const views = [
			this._getButton('submitButton'),
			this._getButton('cancelButton'),
			{ class: View, tagName: 'span', className: 'separator'},
			this._getButton('rightButton')
		];
		
		return views;
	},
	_getButton(name) {
		const arg = this.getOption(name, true);
		
		if (typeof arg === 'string') {
			return { text: arg }
		}
	}
});