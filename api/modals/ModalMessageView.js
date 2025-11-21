import { ButtonView } from '../../ButtonView.js';
import { View } from '../../vendors.js';

export const ModalMessageView = View.extend({
	className: 'modal-message',
	template: `<div class="modal-message-text"><%= message %></div><footer></footer>`,
	templateContext() {
		return {
			message: this.getOption('message', true)
		}
	},
	childViewContainer: 'footer',
	children() {
		const resolve = this._getButton('resolveButton', { className: 'resolve', onActionSuccess: (value) => this.triggerMethod('modal:resolve', value) });
		const reject = this._getButton('rejectButton', { className: 'reject', onActionSuccess: (value) => this.triggerMethod('modal:reject', value) });
		const views = [
			resolve, reject
		];
		console.warn('modal message children', views, this);
		return views;
	},
	_getButton(key, ext) {
		let _btn = this.getOption(key, true);
		if (!_btn){ return; }
		let type = typeof _btn;
		let btn;
		if (type === 'string') {
			btn = { text: _btn };
		} else if (type === 'object') {
			btn = _btn;
		}
		const button = { class: ButtonView };
		const result = Object.assign({}, button, ext, btn);
		return result;
	},
	onModalResolve(val) {
		console.warn('resolve', val)
	},
	childViewTriggers: {
		'modal:resolve':'modal:resolve',
		'modal:reject':'modal:reject',
	}
});