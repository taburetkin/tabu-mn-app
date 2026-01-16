import { buildSchemaData } from "./schemaData";
import { valueSchemaApi } from "./valueSchemaApi";

export const schemaApiViewMixin = {
	initializeSchemaData(ext) { 
		this._esnureSchemaData(ext);
	},
	_buildSchemaData(schemaData, ext) {
		return buildSchemaData(schemaData, ext);
	},
	_esnureSchemaData(ext) {
		if (this.schemaData) { return; }
		
		let schemaData = this.getOption('schemaData', true);
		if (!schemaData) {
			schemaData = this.getOptions(['modelSchema', 'schemaModel', 'schemaCollection'], true);
		}
		this.schemaData = this._buildSchemaData(schemaData, ext);
		this.schemaProperties = this.getOption('schemaProperties', true);
		this.schemaProperty = this.getOption('schemaProperty', true);
		this.valueSchema = this.getOption('valueSchema', true);
		if (!this.valueSchema && this.schemaProperty) {
			this.valueSchema = this.schemaData.schemaCollection.get(this.schemaProperty);
		}
	},
	schemaDisplay() {
		return valueSchemaApi.displayValue(this.valueSchema, this.schemaData);
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