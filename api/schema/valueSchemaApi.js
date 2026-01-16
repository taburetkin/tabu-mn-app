import { Model } from '../../vendors.js';
import { getByPath, setByPath } from '../../utils/objects/byPathUtils.js';
import { displayValueApi } from './displayValueApi.js';
export const valueSchemaApi = {

	valueSchema(valueSchema, options = {}) {

	},

	get(valueSchema, key, options = {}) {
		return getSchemaValue(valueSchema, key, [options]);
	},
	label(valueSchema, options = {}) {
		return getSchemaValue(valueSchema, 'label', [options]);
	},
	inputType(valueSchema, options = {}) {
		return getSchemaValue(valueSchema, 'inputType', [options]);
	},

	inputName(valueSchema, options = {}) {
		if (!valueSchema) { return; }
		let res = getSchemaValue(valueSchema, 'inputName', [options]) || valueSchema.id;
		return res;
	},

	value(valueSchema, options = {}) { 
		const res = callMethod(valueSchema, 'getValue', [options]);
		if (res.ok) return res.value;
		const { schemaModel } = options;
		const value = getModelValue(schemaModel, valueSchema.id);
		return value;
	},

	valueTypes(valueSchema, options) {
		const type = getSchemaValue(valueSchema, 'valueType', [options]);
		const subType = getSchemaValue(valueSchema, 'valueSubType', [options]);
		return [type, subType];
	},

	displayValue(valueSchema, options = {}) {
		
		let value = this.value(valueSchema, options);
		const callRes = callMethod(valueSchema, 'display', [value, valueSchema, options]);
		if (callRes.ok) {
			console.error('display callres', callRes.value)
			return callRes.value;
		}

		const [valueType, valueSubType] = this.valueTypes(valueSchema, options);
		let emptyText = getSchemaValue(valueSchema, 'emptyText', [options]);
		if (emptyText == null) {
			emptyText = options.emptyText
		}
		const prefix = getSchemaValue(valueSchema, 'displayPrefix', [options]);
		const postfix = getSchemaValue(valueSchema, 'displayPostfix', [options]);
		const unit = getSchemaValue(valueSchema, 'unit', [options]);
		const digits = getSchemaValue(valueSchema, 'digits', [options]);
		const html = displayValueApi.display(value, valueType, valueSubType, { prefix, postfix, unit, digits, emptyText });	
		console.warn('display value', html)
		return html;
	},


	setValue(value, valueSchema, options = {}) {
		const res = callMethod(valueSchema, 'setValue', [value, options]);
		if (res.ok) return res.value;
		const { schemaModel } = options;
		const setres = setModelValue(schemaModel, valueSchema.id, value);
		return setres;
	},

	validate(value, valueSchema, options) {
		const required = this.get(valueSchema, 'required', options);
		if (required && (value == null || value === '')) {
			return { ok: false, value: 'обязательное поле' }
		}
		const validateCall = callMethod(valueSchema, 'vallidate', [value, options]);
		if (validateCall.ok) {
			return validateCall.value;
		}
	},





}

function getModelValue(obj, key) {
	if(obj==null) { return; }
	if (obj instanceof Model && obj.isFlat === true) {
		return obj.get(key);
	}
	return getByPath(obj, key);
}

function callMethod(valueSchema, key, args, context) {
	if (!valueSchema) { return { ok: false }}
	if (typeof valueSchema[key] === 'function') {
		context = context || valueSchema;
		return {
			ok: true,
			value: valueSchema[key].apply(context, args)
		};
	} else if (valueSchema instanceof Model) {
		return callMethod(valueSchema.attributes, key, args, valueSchema);
	}
	return { ok: false }
}

function getSchemaValue(valueSchema, key, args) {
	const methodRes = callMethod(valueSchema, key, args);
	if (methodRes.ok) return methodRes.value;
	if (key in valueSchema) {
		return valueSchema[key];
	} else if (valueSchema instanceof Model) {
		return valueSchema.get(key);
	}
}


function setModelValue(obj, key, value) {
	if (obj instanceof Model && obj.isFlat === true) {
		return obj.set(key, value);
	}
	return setByPath(obj, key, value);
}


