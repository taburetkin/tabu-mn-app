import { modelSchemaApi, normalizeValidateResult, schemaApiViewMixin } from "../../../api/schema/index.js";

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
	},
	childViewTriggers: {
		'user:input':'user:input',
	},
	async _validate() {
		if (typeof this.validate === 'function') {
			const res = await this.validate(this.schemaData);
			const normalized = normalizeValidateResult(res);
			return normalized;
		}
		const args = [this.schemaData];
		const propertiesToValidate = this.editConfig.propertiesToValidate || this.getOption('propertiesToValidate', true) || this.editConfig.properties;
		if (propertiesToValidate) {
			args.unshift(propertiesToValidate);
		}
		const res = await modelSchemaApi.validateAsync(...args);
		this.state({ invalid: !res.ok, errors: !res.ok ? res.value : undefined })
		// console.error('>>> _validate <<<', res);
		// console.log(this.formButtons);
		// console.log(this.formButtons?.submitButton);
	}
}