import { asyncMixin } from './async.js';
import { View } from './vendors.js'
import { iconMixin } from './api/icons/index.js';
import { invokeProp } from '../tabu-mn/utils/invokeValue.js';


const actionButtonMixin = {
	...asyncMixin,
	setAction(actionCb) {
		this._action = actionCb;
	},

	async takeActionAsync(event) {

		if (!this.isActionAllowed()) { console.warn('button is not iddle or disabled, action wont taked'); }

		this._setWaiting();

		const res = await this.asyncResult(() => invokeProp(this, '_action', this, [event]));

		this._setIdle();

		if (res.ok) {
			console.log('-button-action-success-', res.value);
			this.triggerMethod('action:success', this, res.value);
		} else {
			console.log('-button-action-fail-', res.value);
			this.triggerMethod('action:fail', this, res.value);
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
			this.takeActionAsync(event);
		}
	}


});

