import { asyncMixin } from './async.js';
import { View } from './vendors.js'
import { iconMixin } from './api/icons/index.js';
import { invokeProp } from '../tabu-mn/utils/invokeValue.js';


const actionButtonMixin = {
	...asyncMixin,
	initializeButton() {
		const buttonType = this.getOption('buttonType', true);
		this.setButtonType(buttonType);
		const action = this.getOption('action', false);
		this.setAction(action);
	},

	setButtonType(type) {
		this._setAttributes({ type });
	},


	setAction(actionCb) {
		this._action = actionCb;
	},

	async takeActionAsync(event) {

		if (!this.isActionAllowed()) { 
			console.warn('button is not iddle or disabled, action wont taked'); 
			return;
		}

		this._setWaiting();
		//const buttonName = this.getOption('name', true);
		this.triggerMethod('before:action', this, event);

		const asyncActionOptions = this.getOption('asyncActionOptions', true);
		const res = await this.asyncResult(() => invokeProp(this, '_action', this, [event, this]), asyncActionOptions);
		console.log('[BUTTON:]', res);
		this.triggerMethod('after:action', this, event, res);

		this._setIdle();

		if (res.ok) {
			this.triggerMethod('action:success', this, event, res.value);
		} else {
			this.triggerMethod('action:fail', this, event, res.value);
		}
	},

	isActionAllowed() {
		return this.isEnabled() && this.isIdle();
	},
	isIdle() { return !this.state('waiting'); },
	isWaiting() { return !!this.state('waiting'); },
	isDisabled() { return !!this.state('disabled'); },
	isEnabled() { return !this.state('disabled'); },

	_setWaiting() { this.state('waiting', true); },
	_setIdle() { this.state('waiting', false); },

	disable() {
		this.state('disabled', true);
	},

	enable() {
		this.state('disabled', false);
	},


}


export const ButtonView = View.extend({

	...iconMixin,
	...actionButtonMixin,
	tagName: 'button',
	baseClassName: 'app-btn',
	stateClassNames: ['disabled', 'waiting'],
	template: `<span class="wrapper">
	<%= iconHtml %>
	<%= textHtml %>
	<%= badgeHtml %>
</span>`,

	templateContext() {
		return {
			iconHtml: this._iconHtml(),
			textHtml: this._textHtml(),
			badgeHtml: this._badgeHtml(),
		}
	},

	initialize() {
		this.initializeButton();
	},

	_iconHtml() {
		const html = this.getIconHtml();
		return html || '';
	},
	_textHtml() {
		const text = this.getOption('text', true);
		return text ? `<span class="button-text">${text}</span>` : '';
	},
	_badgeHtml() {
		const badge = this.getOption('badge', true);
		return badge ? `<span class="button-badge">${badge}</span>` : '';
	},

	events: {
		click(event) {
			event.stopPropagation();
			if (this.getOption('preventDefault', true)) {
				event.preventDefault();
			}
			this.takeActionAsync(event);
		}
	}


});

