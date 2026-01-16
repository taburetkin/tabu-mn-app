import { View } from 'core';
import './filter-operator-container.less'
export const OperatorView = View.extend({
	baseClassName: 'filter-operator-container',
	template: '<span><%= operatorLabelShort %></span>',
	templateContext() {
		return {
			operatorLabelShort: this.model.getOperatorLabelShort()
		}
	}
});