import { setValueMixin } from "./setValueMixin.js";
import { debounce } from '../../vendors.js';

export const commonInputMixin = {
	// ...setValueMixin,
	initializeInput() {
		this._setInputedValue = debounce(this._setInputedValue, 150);
		this.on('attach', this._tryFocus);
		this.delegate('keydown', this._handleKeyDown.bind(this));
		this.delegate('keyup', this._handleKeyUp.bind(this));
	},
	_tryFocus() {
		if (document.activeElement && document.activeElement !== document.body) {
			return; // console.log('active exist', document.activeElement);
		}
		this.$('input').focus();
	},
	_handleKeyUp(event) {
		const ctrl = event.ctrlKey;
		const keyCode = event.keyCode;
		const value = event.target.value;
		let ok = true;
		let type;
		if (keyCode === 13 && this.userInputDoneCtrlKey === ctrl) {
			type = 'done';
			this.triggerMethod('user:input')
		} else if (keyCode === 27) {
			ok = false;
			type = 'cancel';
		}
		this._handleInput({ ok, type, value }, event);
	},	
	_handleKeyDown(event) {
		const keyCode = event.keyCode;
		if (keyCode === 9 && this.allowTabKey) {
			event.preventDefault();
			event.target.value = (event.target.value || '') + '\t';
			const value = event.target.value;
			this._handleInput({ ok: true, type: undefined, value }, event);
		}
	},
	_handleInput(val, event) {
		let doneEventArgument;
		if (val.ok) {
			doneEventArgument = val.type === 'done';

			this._setInputedValue(val.value, val.type === 'done');
		} else if (val.type === 'cancel') {
			this.triggerInputDone(val.value, false);
		}
	},
	async _setInputedValue(value, done) {
		console.warn('_setInputedValue', value);
		value = this._normalizeInputedValue(value);
		this.schemaSet(value, done)
	},
	_normalizeInputedValue(value) {

		if (value === '') {
			return undefined;
		}

		const [type, subType] = this.schemaValueTypes();

		if (type === 'number') {
			if (value.endsWith('.')) {
				value.substring(0, value.length - 1);
			}
			if (value === '') {
				return undefined;
			}
			value = subType === 'integer' ? parseInt(value, 10) : parseFloat(value, 10);
		} else if (type === 'boolean') {
			const lower = value.toLowerCase();
			const bool = booleans[lower];
			console.log({ bool, lower })
			return bool;
		}

		return value;

	},
	getInputType() {
		if (this.hasOption('inputType')) {
			return this.getOption('inputType', true);
		}
		let res = this.schemaGet('inputType');
		if (res != null) {
			return res;
		}
		const [type, subType] = this.schemaValueTypes();
		if (type === 'number') {
			return type;
		}
		if (subType === 'password' || subType === 'email') {
			return subType;
		}
		return 'text';
	}
}

const booleans = {
	true: true,
	false: false,
	1: true,
	0: false
}