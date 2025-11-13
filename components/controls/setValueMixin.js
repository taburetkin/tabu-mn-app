import { valueSchemaApi } from "../../api/schema/index.js";
import './edit-control.less';
export const setValueMixin = {

	async schemaSet(value, done) {
		const validateRes = await this._validateAsync(value, done);
		valueSchemaApi.setValue(value, this.valueSchema, this.schemaData);
		console.log('schemaSet', value, ' -- ', this.schemaData.schemaModel);
		this.triggerMethod('user:input', this.valueSchema.id, value, done);
		if (done) {
			this.triggerInputDone(value, done);
		}
		return validateRes;
	},

	async _validateAsync(value, done, isInitial) {
		this.triggerMethod('before:validate', value);
		let result;
		if (typeof this.validate === 'function') {
			result = this.validate(value, done, isInitial);
		} else {
			result = valueSchemaApi.validate(value, this.valueSchema, this.schemaData);
		}
		const res = await normalizeResultAsync(result, this.valueSchema);
		this.triggerMethod('validate', res, { value, isInitial, done });
		return res;
	},
	initialValidateAsync() {
		const value = this.schemaValue();
		return this._validateAsync(value, true, true);
	},
	triggerInputDone(value, resolve) {
		this.triggerMethod('user:input:done', this.valueSchema.id, value, resolve);
	},

}

async function normalizeResultAsync(arg, valueSchema) {
	let result = await arg;

	if (result != null && 'ok' in result) {
		return result;
	}

	if (Array.isArray(result) && result.length === 0) {
		result = undefined;
	}

	const ok = result == null;

	return {
		ok,
		value: result
	}

}