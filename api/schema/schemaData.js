const sign = Symbol('schema-data');
import { Model } from '../../vendors.js';
import { modelSchemaApi } from './modelSchemaApi';
import { getSchemaCollection } from './schemaCollection.js';

export function buildSchemaData(data, ext) {
	if (data && sign in data) {
		return data;
	}
	data = data || {};
	let { modelSchema, schemaModel, schemaCollection } = data;

	let modelType;
	if (!schemaModel) {
		schemaModel = {};
		modelType = 'object';
	} else {
		modelType = schemaModel instanceof Model ? 'model' : 'unknown';
	}

	schemaCollection = getSchemaCollection(schemaCollection, modelSchema);
	modelSchema = schemaCollection.getSchema();
	console.warn(modelSchema)

	const schemaData = Object.assign({}, data, { [sign]: true, modelSchema, schemaModel, modelType, schemaCollection }, ext);

	return schemaData;
}