import { normalizeValidateResult } from "./validate";
import { valueSchemaApi } from "./valueSchemaApi";

const modelSchemaSign = Symbol("model-schema");
export const modelSchemaApi = {
	normalize(schema) {

		if (schema && modelSchemaSign in schema) { return schema; }

		schema = Object.assign({}, schema, { [modelSchemaSign]: true });
		const keys = Object.keys(schema);

		for(let key of keys) {
			const valueSchema = schema[key];
			valueSchema.id = schema.id || key;
			valueSchema.path = schema.path || key;
		}

		return schema;
	},
	valueSchema(valueSchema, options) { },

	async validateAsync(arg1, arg2) {
		let schemaData;
		let properties;
		if (arguments.length === 1) {
			schemaData = arg1;
			properties = Object.keys(schemaData.modelSchema);
		} else {
			properties = arg1;
			schemaData = arg2;
		}
		const col = schemaData.schemaCollection;
		const errors = {}
		let invalid;
		for(let prop of properties) {
			const valueSchema = col.get(prop);
			const value = valueSchemaApi.value(valueSchema, schemaData);
			console.warn('	val:', prop, value)
			const res = await valueSchemaApi.validate(value, valueSchema);
			const normalized = normalizeValidateResult(res);
			if (normalized.ok) continue;
			invalid = true;
			addErrors(errors, valueSchema, normalized.value);
		}
		return {
			ok: !invalid,
			value: invalid ? errors : undefined
		}
	}
}

function addErrors(errors, valueSchema, valueErrors) {
	if (valueErrors == null) {
		valueErrors = ['internal error'];
	}
	if (!Array.isArray(valueErrors)) {
		valueErrors = [valueErrors];
	}

	let exist = errors[valueSchema.id];
	if (!exist) {
		exist = [];
		errors[valueSchema.id] = exist;
	}
	exist.push(...valueErrors);
}