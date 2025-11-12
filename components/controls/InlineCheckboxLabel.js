import { valueSchemaApi } from '../../api/schema/valueSchemaApi.js';
import { schemaApiViewMixin } from '../../api/schema/schemaApiViewMixin.js';
import { View } from '../../vendors.js';
import { setValueMixin } from './setValueMixin.js';


export const InlineCheckboxLabel = View.extend({
	...schemaApiViewMixin,
	...setValueMixin,
	className: 'inline-checkbox-label edit-control',
	template: `<label class="wrapper"><span class="input-container"><input type="checkbox" name="<%= id %>"></span><span class="text"><%= label %></span></label>`,
	initialize() {
		this.initializeSchemaData();
		this.initialValidateAsync();
	},
	templateContext() {
		return {
			id: this.valueSchema.id,
			label: this.schemaGet('label'),
			name: valueSchemaApi.inputName(this.valueSchema, this.schemaData)
		}
	}
});

