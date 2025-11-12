import { valueSchemaApi } from "../../api/schema/index.js";
import './edit-control.less';
export const setValueMixin = {
	async schemaSet(value, done) {
		const validateRes = await this._validateAsync(value, done);
		valueSchemaApi.setValue(value, this.valueSchema, this.schemaData);
		this.triggerMethod('user:input', value, done);
		if (done) {
			this.triggerInputDone(value, done);
		}
		return validateRes;
	},

	_validateAsync(value, done) {
		this.triggerMethod('before:validate', value);
		let result;
		if (typeof this.validate === 'function') {
			result = this.validate(value, done);
		} else {
			result = valueSchemaApi.validate(value, this.valueSchema, this.schemaData);
		}
		const res = normalizeResultAsync(result, this.valueSchema);
		this.triggerMethod('validate', res, value);
		console.log('initial validate done')
		return res;
	},
	initialValidateAsync() {
		const value = this.schemaValue();
		console.log('initial validate');
		return this._validateAsync(value, true);
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