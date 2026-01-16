//import { View } from 'core';
import { RangeInput } from '../../controls/RangeInput';
import { PropertyView, PropertyValueView } from '../../properties';
import { OperatorView } from './OperatorView';

const FilterValueView = PropertyValueView.extend({
	detectEditControl() {
		if (this.model.isRangeEdit()) {
			return RangeInput;
		}
		//console.log('here i cooooooom, tobe sent to an angel', arguments[0])
		return PropertyValueView.prototype.detectEditControl.apply(this, arguments);
	},
	prefixValueView() {
		return OperatorView;
	}
})

export const FilterItemView = PropertyView.extend({
	initialize() {
		const options = {
			edit: true,
			inlineEdit: false,
			emptyText: '&mdash;',
		}
		this.initializeSchemaData(options);
	},
	ValueView: FilterValueView,
	getChildren(){
		const label = this.getLabelView();
		const operator = this.getOperatorView();
		const value = this.getValueView();
		const views = [label, operator, value];
		return views;
	},
	getLabelView() {
		return this.getOption('LabelView', true);
	},
	getOperatorView() {
		//return OperatorView;
	}
});