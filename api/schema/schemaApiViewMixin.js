import { buildSchemaData } from "./schemaData";
import { valueSchemaApi } from "./valueSchemaApi";

export const schemaApiViewMixin = {
	initializeSchemaData(ext) { 
		this._esnureSchemaData(ext);
	},
	_esnureSchemaData(ext) {
		if (!this.schemaData) {
			let schemaData = this.getOption('schemaData', true);
			if (!schemaData) {
				schemaData = this.getOptions(['modelSchema', 'schemaModel', 'schemaCollection'], true);
			}
			this.schemaData = buildSchemaData(schemaData, ext);
			this.schemaProperties = this.getOption('schemaProperties', true);
			this.schemaProperty = this.getOption('schemaProperty', true);
			this.valueSchema = this.getOption('valueSchema', true);
			if (!this.valueSchema && this.schemaProperty) {
				this.valueSchema = this.schemaData.schemaCollection.get(this.schemaProperty);
			}
		}
	},
	schemaValue() {
		return valueSchemaApi.value(this.valueSchema, this.schemaData);
	},
	schemaValueTypes() {
		return valueSchemaApi.valueTypes(this.valueSchema, this.schemaData);
	},
	schemaGet(key) {
		return valueSchemaApi.get(this.valueSchema, key, this.schemaData);
	}
}