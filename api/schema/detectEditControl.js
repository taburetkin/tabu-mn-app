import { detectControl } from "../../components/controls/detectControl.js";
import { valueSchemaApi } from "./valueSchemaApi.js";

export function detectEditControl(valueSchema, schemaData, options = {}) {
	const { inline } = options;
	const control = valueSchemaApi.get(valueSchema, inline ? 'inlineControl' : 'control');
	if (control) { return control; }

	const [valueType, valueSubType] = valueSchemaApi.valueTypes(valueSchema, schemaData);
	const controlName = valueSchemaApi.get(valueSchema, 'controlName');
	const sourceValues = valueSchemaApi.get(valueSchema, 'sourceValues');
	return detectControl({ valueType, valueSubType, controlName, sourceValues, inline })
}