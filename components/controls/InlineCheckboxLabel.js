import { valueSchemaApi } from '../../api/schema/valueSchemaApi.js';
import { View } from '../../vendors.js';
import { controlMixin } from './controlMixin.js';


export const InlineCheckboxLabel = View.extend({
	...controlMixin,
	className: 'inline-checkbox-label edit-control',
	template: `<label class="wrapper"><span class="input-container"><input type="checkbox" name="<%= id %>"></span><span class="text"><%= label %></span></label>`,
	initialize() {
		this.initializeControl();
	},
	templateContext() {
		return {
			id: this.valueSchema.id,
			label: this.schemaGet('label'),
			name: valueSchemaApi.inputName(this.valueSchema, this.schemaData)
		}
	}
});

