import { modals as _modals, isView, isViewClass, attachView } from '../../vendors.js';
import { L } from '../localize/index.js';
import { ModalMessageView } from './ModalMessageView.js';
import { ModalView } from './ModalView.js';

export const modals = {

	destroyAll() {
		_modals.destroyAll();
	},

	showView(view, modalOptions = {}) {
		if (!isView(view)) {
			throw new Error('unable to show modal view - view is missing');
		}
		else if (view.isDestroyed()) {
			throw new Error('unable to show modal view - view is destroyed');
		}

		const { attachTo = document.body, destroyOnEsc = true, destroyOnExternalClick = true } = modalOptions;
		const options = {
			destroyOnEsc,
			isExternalElement: destroyOnExternalClick 
				? el => view.isExternalElement ? view.isExternalElement(el) : !view.contains(el) 
				: undefined,
			attach: () => attachView(view, { el: attachTo }),
			destroy: () => view.destroy(),
			promise: new Promise((ok, notOk) => {
				view.on({
					'modal:close': createResolver(notOk, 'closed'),
					'modal:cancel': createResolver(notOk, 'canceled'),
					'modal:resolve': createResolver(ok, 'resolved'),
					'modal:reject': createResolver(notOk, 'rejected'),
				});
			})
		}
		return _modals.show(options);
	},

	show(arg, modalOptions = {}) {
		if (arg == null) {
			throw new Error('unable to show modal view, content argument missing');
		}
		let content;
		if (isView(arg)) {
			if (arg.isDestroyed()) {
				throw new Error('unable to show modal view - view is destroyed');
			}
			content = arg;
		}
		else {
			content = arg;
		}

		const { 
			modalClassName = 'modal-default', 
			noBg, noFooter, noHeader,
			modalBoxClassName, 
			modalContentClassName, 
			headerText, 
			footerView, footerButtons, footerVariant 
		} = modalOptions;
		
		console.warn('modal', modalOptions);
		console.warn('modal', modalClassName);

		const view = new ModalView({ 
			content, 
			modalClassName, 
			noBg, 
			noFooter, 
			noHeader,
			modalBoxClassName, 
			modalContentClassName, 
			headerText,
			footerView, 
			footerButtons, 
			footerVariant
		});

		return this.showView(view, modalOptions);

	},
	
	message(arg1, arg2, arg3) {
		const { message, headerText, modalOptions = {} } = normalizeArgs.apply(this, arguments);
		let { resolveButton, rejectButton } = modalOptions;
		if (!resolveButton) {
			resolveButton = L('modal.button.close')
		}
		const view = {
			class: ModalMessageView,
			message,
			resolveButton, rejectButton
		}
		const _modalOptions = Object.assign({ modalBoxClassName: 'info-message' }, modalOptions, { headerText });
		return this.show(view, _modalOptions);
	},

	warn() {
		let { message, headerText, modalOptions } = normalizeArgs.apply(this, arguments);
		modalOptions = Object.assign({ modalBoxClassName: 'warn-message' }, modalOptions);
		return this.message(headerText, message, modalOptions);
	},

	error() {
		let { message, headerText, modalOptions } = normalizeArgs.apply(this, arguments);
		modalOptions = Object.assign({ modalBoxClassName: 'error-message' }, modalOptions);
		return this.message(headerText, message, modalOptions);
	},

	confirm() {
		let { message, headerText, modalOptions } = normalizeArgs.apply(this, arguments);
		modalOptions = Object.assign({
			resolveButton: L('modal.button.confirm'),
			rejectButton: L('modal.button.cancel'),
			modalBoxClassName: 'confirm-message',
		}, modalOptions)
		return this.message(headerText, message, modalOptions);
	},

}

function normalizeArgs(arg1, arg2, arg3) {
	let message, headerText, modalOptions;
	if (arguments.length === 3) {
		modalOptions = arg3 || {};
		headerText = arg1;
		message = arg2;
	}
	else if (arguments.length === 2) {
		if (typeof arg2 === 'object') {
			message = arg1;
			modalOptions = arg2;
		} else {
			headerText = arg1;
			message = arg2;
			modalOptions = {};
		}
	}
	else if (arguments.length === 1) {
		message = arg1;
		modalOptions = {};
	}
	return {
		message, headerText, modalOptions
	}
}

function selectValue(value, defaultValue) {
	return value != null ? value : defaultValue;
}

function createResolver(resolveMethod, defaultValue) {
	return value => resolveMethod(selectValue(value, defaultValue))
}