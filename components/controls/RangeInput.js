import { valueSchemaApi } from '../../api/schema/valueSchemaApi.js';
import { View } from '../../vendors.js';
import { controlMixin } from './controlMixin.js';
import { InputView } from './Input.js';


const rangeSchema = {
	from: { 
		label: 'от'
	},
	to: {
		label: 'до'
	}
}

function createSchema(valueSchema) {
	const attrs = valueSchema?.attributes || valueSchema || {};
	const schema = {
		from: Object.assign({}, attrs, rangeSchema.from),
		to: Object.assign({}, attrs, rangeSchema.to)
	}
	return schema;
}


const FromInputView = InputView.extend({
	valueSchema:{}, schemaData: {}
});
const ToInputView = InputView.extend({
	valueSchema:{}, schemaData: {}
});

export const RangeInput = View.extend({
	...controlMixin,
	className: 'range-input edit-control',
	//template: `<label class="wrapper"><span class="input-container"><input type="checkbox" name="<%= id %>" <%= checked %>></span><span class="text"><%= label %></span></label>`,
	initialize() {
		this.initializeControl();
		console.error('range', this)
	},
	childViewOptions() {
		const modelSchema = createSchema(this.schemaData.modelSchema);
		const schemaModel = {};
		return {
			schemaData: this._buildSchemaData({ modelSchema, schemaModel }),
		}
	},
	considerChildViewKeyAs:'name',
	fromOptions() {
		return {
			property: 'from'
		}
	},
	toOptions() {
		return {
			property: 'to'
		}
	},
	children:{
		from: FromInputView,
		to: ToInputView
	}

});