import { valueSchemaApi } from "../../api/schema/index.js";
import './edit-control.less';
export const setValueMixin = {
	async schemaSet(value, done) {
		this.triggerMethod('before:validate', value);
		const validateRes = await this._validateAsync(value, done);
		this.triggerMethod('validate', validateRes, value);
		valueSchemaApi.setValue(value, this.valueSchema, this.schemaData);
		this.triggerMethod('user:input', value, done);
		if (done) {
			this.triggerInputDone(value, done);
		}
		return validateRes;

	},

	_validateAsync(value, done) {
		let result;
		if (typeof this.validate === 'function') {
			result = this.validate(value, done);
		} else {
			result = valueSchemaApi.validate(value, this.valueSchema, this.schemaData);
		}
		return normalizeResultAsync(result, this.valueSchema);
	},

	triggerInputDone(value, resolve) {
		this.triggerMethod('user:input:done', value, resolve);
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