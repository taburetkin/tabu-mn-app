import { valueSchemaApi } from '../../api/index.js';
import { schemaApiViewMixin } from '../../api/schema/schemaApiViewMixin.js';
import { View } from '../../vendors.js';
import { commonInputMixin } from './commonInputMixin.js';


export const InputView = View.extend({
	baseClassName: 'inline-user-input edit-control',
	template: '<div class="wrapper"><input<%= inputAttributes %>></div>',
	...schemaApiViewMixin,
	...commonInputMixin,
	inputTagName: 'input',

	userInputDoneCtrlKey: false,
	allowTabKey: false,

	initialize() {
		this.on('all', e => console.log(']]	->', e))
		this.initializeSchemaData();
		this.initializeInput();
		this.initialValidateAsync();

		//this.on('attach', this._tryFocus);
	},
	templateContext() {
		return {
			inputAttributes: this.buildInputAttributes()
		}
	},
	buildInputAttributes() {
		const attrs = {
			name: this.getInputName(),
			type: this.getInputType(),
		}
		attrs.value = this.schemaValue();
		const autofill = this.schemaGet('inputAutocomplete');
		if (autofill) {
			attrs.autocomplete = true;
		}		
		let text = ' ' + Object.keys(attrs).filter(f => attrs[f] != null).map(key => `${key}="${attrs[key] === true ? key : attrs[key]}"`).join(' ');
		return text;
	},
	// getInputType() {
	// 	return valueSchemaApi.inputType(this.valueSchema, this.schemaData);
	// },
	getInputName() {
		return valueSchemaApi.inputName(this.valueSchema, this.schemaData);
	},

});