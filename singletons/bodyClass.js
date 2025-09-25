import { Model } from '../vendors.js';

const BodyClass = Model.extend({
	initialize() {
		this.on('change', this._onChange);
	},
	_onChange() {
		const classString = this._buildClassString();
		this._setClass(classString);
	},
	_buildClassString() {
		const hash = {};
		for(let key in this.attributes) {
			let value = this.attributes[key];
			if (value == null || value === '' || value === false) continue;
			if (typeof value !== 'string' || value === true) value = key;
			hash[value] = 1;
		}
		return Object.keys(hash).join(' ');
	},
	_setClass(className) {
		if (!className) {
			document.body.removeAttribute('class');
		} else {
			document.body.setAttribute('class', className);
		}
	}
});

export const bodyClass = new BodyClass();