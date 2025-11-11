import { Model } from '../../vendors.js';
import { getByPath, setByPath } from '../../utils/objects/byPathUtils.js';
export const valueSchemaApi = {

	valueSchema(valueSchema, options = {}) {

	},

	get(valueSchema, key, options = {}) {
		return getSchemaValue(valueSchema, key, options);
	},
	label(valueSchema, options = {}) {
		return getSchemaValue(valueSchema, 'label', options);
	},
	inputType(valueSchema, options = {}) {
		return getSchemaValue(valueSchema, 'inputType', options);
	},

	inputName(valueSchema, options = {}) {
		let res = getSchemaValue(valueSchema, 'inputName', options) || valueSchema.id;
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
		const type = getSchemaValue(valueSchema, 'valueType', options);
		const subType = getSchemaValue(valueSchema, 'valueSubType', options);
		return [type, subType];
	},

	displayValue(valueSchema, options = {}) { },


	setValue(value, valueSchema, options = {}) {
		const res = callMethod(valueSchema, 'setValue', [value, options]);
		if (res.ok) return res.value;
		const { schemaModel } = options;
		const setres = setModelValue(schemaModel, valueSchema.id, value);
		return setres;
	},

	validate(value, valueSchema, options) {

	},





}

function getModelValue(obj, key) {
	if (obj instanceof Model && obj.isFlat === true) {
		return obj.get(key);
	}
	return getByPath(obj, key);
}

function callMethod(valueSchema, key, args, context) {
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

function getSchemaValue(valueSchema, key, options) {
	const methodRes = callMethod(valueSchema, key, [options]);
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