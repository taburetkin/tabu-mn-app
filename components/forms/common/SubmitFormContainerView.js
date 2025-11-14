import { ButtonView } from '../../../ButtonView.js';
import { View } from '../../../vendors.js';

const Tmp = ButtonView.extend({
	initialize() {
		this.on('all', (e,a) => console.log('btn', e, a))
	}
})

export const SubmitFormContainerView = View.extend({
	name: 'formButtons',
	setAsParentProperty: 'formButtons',
	baseClassName: 'submit-form-container',
	childView: Tmp, //ButtonView,
	parentShouldTriggerSetup: true,
	initialize() {
		console.log('SUBMITS', this);
	},
	children() {
		const views = [
			this._getButton('submit'),
			this._getButton('cancel'),
			{ class: View, tagName: 'span', className: 'separator'},
			this._getButton('right')
		];
		
		return views;
	},
	_getButton(name) {
		const buttonName = name + 'Button';
		const arg = this.getOption(buttonName, true);
		
		if (typeof arg === 'string') {
			const action = this.getOption(name + 'Action', false);
			return { text: arg, name: buttonName, setAsParentProperty: buttonName, className: name, action }
		}
	},
	onSetup(parent) {
		this.listenTo(parent, 'state:invalid', (stateValue) => {
			if (stateValue) {
				this.submitButton.disable();
			} else {
				this.submitButton.enable();
			}
		});
	},
	childViewEvents: {
		'after:action'(btn, res) {
			const event = btn ? btn : 'button';
			this.triggerMethod(event + ':click', res);
			if (event !== 'button')
				this.triggerMethod('button:click', btn, res);
			
		},
	}
});