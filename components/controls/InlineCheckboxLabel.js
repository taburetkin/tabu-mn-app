import { valueSchemaApi } from '../../api/schema/valueSchemaApi.js';
import { schemaApiViewMixin } from '../../api/schema/schemaApiViewMixin.js';
import { View } from '../../vendors.js';


export const InlineCheckboxLabel = View.extend({
	...schemaApiViewMixin,
	className: 'inline-checkbox-label edit-control',
	template: `<label class="wrapper"><span class="input-container"><input type="checkbox" name="<%= id %>"></span><span class="text"><%= label %></span></label>`,
	initialize() {
		this.initializeSchemaData();
	},
	templateContext() {
		return {
			id: this.valueSchema.id,
			label: this.schemaGet('label'),
			name: valueSchemaApi.inputName(this.valueSchema, this.schemaData)
		}
	}
});

