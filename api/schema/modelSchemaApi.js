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
	valueSchema(valueSchema, options) { }
}