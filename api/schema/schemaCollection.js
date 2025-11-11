import { Collection, Model } from '../../vendors.js';
import { modelSchemaApi } from './modelSchemaApi.js';

const ValueSchema = Model.extend({
	isNoLabel() {
		const nolabel = this.get('controlName') === 'inline-checkbox-label' || this.get('noLabel') === true;
		return nolabel;
	}
})

const schemaCollectionKey = Symbol('schema-collection');

export const SchemaCollection = Collection.extend({
	constructor: function(models, options = {}) {
		Collection.apply(this, arguments);
		this.initializeSchema(options.schema);
	},
	model: ValueSchema,
	initializeSchema(schema) {
		if (schema) {
			this.schema = modelSchemaApi.normalize(schema);
			this.schema[schemaCollectionKey] = this;
			this.populateSchemaModels();
		}
	},
	populateSchemaModels() {
		const keys = Object.keys(this.schema);
		const models = keys.map(id => this.schema[id]);
		this.add(models);
	},
	getSchema() {
		if (this.schema) return this.schema;
		const schema = this.models.reduce((memo, model) => {
			memo[model.id] = Object.assign({}, model.attributes);
			return memo;
		}, { [schemaCollectionKey]: this });
		this.schema = modelSchemaApi.normalize(schema);
		return this.schema;
	}
});



export function getSchemaCollection(schemaCollection, modelSchema = {}) {

	if (schemaCollection) { return schemaCollection; }

	if (modelSchema[schemaCollectionKey]) {
		return modelSchema[schemaCollectionKey];
	}

	const collection = new SchemaCollection([], { schema: modelSchema });

	return collection;
}

