import { valueSchemaApi } from '../../api/index.js';
import { schemaApiViewMixin } from '../../api/schema/schemaApiViewMixin.js';
import { View } from '../../vendors.js';
import { commonInputMixin } from './commonInputMixin.js';
import { controlMixin } from './controlMixin.js';


export const InputView = View.extend({
	baseClassName: 'inline-user-input edit-control',
	template: '<div class="wrapper"><input<%= inputAttributes %>></div>',
	//...schemaApiViewMixin,
	...controlMixin,
	...commonInputMixin,

	inputTagName: 'input',

	userInputDoneCtrlKey: false,
	allowTabKey: false,
	
	initialize() {
		//this.on('all', e => console.log('	]]	->', e));
		this.initializeControl();
		this.initializeInput();
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
		const autocomplete = this.schemaGet('inputAutocomplete');
		if (autocomplete) {
			attrs.autocomplete = autocomplete;
		}		
		let text = ' ' + Object.keys(attrs).filter(f => attrs[f] != null).map(key => `${key}="${attrs[key] === true ? key : attrs[key]}"`).join(' ');
		return text;
	},
	// getInputType() {
	// 	return valueSchemaApi.inputType(this.valueSchema, this.schemaData);
	// },
	getInputName() {
		if (this.hasOption('inputName')) {
			return this.getOption('inputName', true);
		}
		return valueSchemaApi.inputName(this.valueSchema, this.schemaData);
	},

});