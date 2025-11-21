import { schemaApiViewMixin } from '../../../api/schema/schemaApiViewMixin.js';
import { ButtonView } from '../../../ButtonView.js';
import { View } from '../../../vendors.js';


const namedButtonOptionsKeys = {
	action: (name, view) => view.getOption(name + 'Action', false),
	asyncActionOptions: (name, view) => view.getOption(name + 'AsyncActionOptions', true)
};
const namedButtonOptionsKeysArray = Object.keys(namedButtonOptionsKeys).map(key => key[0].toUpperCase() + key.substring(1));

export const SubmitFormContainerView = View.extend({
	name: 'formButtons',
	setAsParentProperty: 'formButtons',
	baseClassName: 'submit-form-container',
	childView: ButtonView,
	parentShouldTriggerSetup: true,
	...schemaApiViewMixin,
	initialize() {
		//this.on('all', e => console.error('[buttons]',e));
		this.initializeSchemaData();		
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
		if (arg == null) return;

		if (typeof arg === 'string') {
			//const action = this.getOption(name + 'Action', false);
			const buttonType = name === 'submit' ? 'submit' : undefined;
			const btn = Object.assign({ 
				text: arg, 
				name: buttonName, 
				setAsParentProperty: buttonName, 
				buttonName: name,
				className: name, 
//				action,
				preventDefault: true,
				buttonType,
				schemaData: this.schemaData,
				schemaModel: this.schemaData.schemaModel
			}, getNamedOptions(name, this));
			console.log('btn', btn, this)
			return btn;
		}

		if (typeof arg === 'object') {
			
			const btn = Object.assign({
				name: buttonName, 
				setAsParentProperty: buttonName, 
				buttonName: name,
				className: name, 
				preventDefault: true,
				schemaData: this.schemaData,
				schemaModel: this.schemaData.schemaModel
			}, arg);
			console.log('btn', btn, this);
			return btn;
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
		'before:action'(...args) {
			return this._triggerButtonEvent('before:action', ...args);
		},
		'after:action'(...args) {
			return this._triggerButtonEvent('after:action', ...args);
		},
		'action:success'(...args) {
			return this._triggerButtonEvent('action:success', ...args);
		},
		'action:fail'(...args) {
			return this._triggerButtonEvent('action:fail', ...args);
		},
	},
	_triggerButtonEvent(eventName, btn, event, ...rest) {
		this.triggerMethod('button:event', eventName, btn, event, ...rest);
	}
});


function getNamedOptions(name, view) {
	const options = Object.keys(namedButtonOptionsKeys).reduce((memo, key) => {
		memo[key] = namedButtonOptionsKeys[key](name, view);
		return memo;
	}, {});
	return options;
}

export function getButtonsOptions(view, names) {
	const options = names.reduce((memo, name) => {
		const buttonOptions = view.getOption(name + 'Button', true);
		if (buttonOptions) {
			memo[name + 'Button'] = buttonOptions;
			if (typeof buttonOptions === 'object') {
				return memo;
			}
		}

		for(let key of namedButtonOptionsKeysArray) {
			memo[name + key] = view.getOption(name + key, false);
		}

		return memo;
	}, {});
	return options;
}
