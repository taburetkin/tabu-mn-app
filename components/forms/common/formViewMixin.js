import { modelSchemaApi, normalizeValidateResult, schemaApiViewMixin } from "../../../api/schema/index.js";
import { getButtonsOptions } from "./SubmitFormContainerView.js";

export const formViewMixin = {

	...schemaApiViewMixin,

	initializeForm(schemaData) {
		schemaData = schemaData || { inlineEdit: true, edit: true };
		this.initializeSchemaData(schemaData);
		this.editConfig = this.editConfig || this.getOption('editConfig', true) || {};
		this.validate = this.validate || this.editConfig.validate || this.options.validate;
		this.on('user:input', this._validate);
		if (this.editConfig.initialValidate) {
			this.once('render', this._validate);
		}
		this.initializeButtonsEvents();
	},
	initializeButtonsEvents() {
		if (!this._childViewEvents) {
			this._childViewEvents = {};
		}
		if (!this._childViewEvents['button:event']) {
			this._childViewEvents['button:event'] = this.handleButtonEvent;
		}
	},
	handleButtonEvent(eventName, button, event, ...rest) {
		const buttonName = button.getOption('buttonName', true) || 'button';
		const buttonEventName = buttonName + ':' + eventName;
		this.triggerMethod(buttonEventName, button, event, ...rest);
	},
	childViewTriggers: {
		'user:input':'user:input',
	},
	async _validate() {
		if (typeof this.validate === 'function') {
			const res = await this.validate(this.schemaData);
			const normalized = normalizeValidateResult(res);
			const ignoreSchemaValidation = this.getOption('ignoreSchemaValidation', true);
			if (!normalized.ok || ignoreSchemaValidation) {
				return normalized;
			}
		}
		const args = [this.schemaData];
		const propertiesToValidate = this.editConfig.propertiesToValidate || this.getOption('propertiesToValidate', true) || this.editConfig.properties;
		if (propertiesToValidate) {
			args.unshift(propertiesToValidate);
		}
		const res = await modelSchemaApi.validateAsync(...args);
		this.state({ invalid: !res.ok, errors: !res.ok ? res.value : undefined });
	},

	formButtonsOptions() {
		const options = getButtonsOptions(this, ['submit', 'cancel', 'right']);
		// const options = this.getOptions([
		// 	'submitButton', 'submitAction',
		// 	'cancelButton', 'cancelAction',
		// 	'rightButton', 'rightAction'
		// ], false);
		console.log('opts', options);
		return options;
	},

}