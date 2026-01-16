import { Model } from '../../../vendors.js';
import { operatorsCollection } from './operators';
import { getTypeDefaultOperator, isNumeric } from './types';

export const FilterItemModel = Model.extend({
	initialize() {

	},
	getOperator() {
		let id = this.get('operatorId');
		if (!id) {
			id = getTypeDefaultOperator(this.get('valueType'));
		}
		const operator = operatorsCollection.get(id);
		console.warn(id, operator)
		return operator;
	},
	setOperator(operatorId) {
		const operator = operatorsCollection.get(operatorId);
		if(operator == null) { throw new Error(`operator "${operatorId}" not found`); }
		const value = this.get('value');
		const changes = {
			operator: operatorId,
		}
		if (this._shouldCleanValueOnOperatorChange(operator, this.operator)) {
			changes.value = undefined;
		}
		this.operator = operator;
		this.set(changes);
	},
	_shouldCleanValueOnOperatorChange(nextOperator, prevOperator) {

	},
	getOperatorLabel() {
		const op = this.getOperator();
		return op?.get('label') || ':(';
	},
	getOperatorLabelShort() {
		const op = this.getOperator();
		return op?.get('labelShort') || ':(';
	},
	hasValue() {

	},
	isRangeEdit() {
		if (this.hasValue()) {
			return !!this.get('isRange')
		} else {
			return this.isNumericType()
		}
	},
	isNumericType() {
		const valueType = this.get('valueType');
		return isNumeric(valueType);
	}
});