import { schemaApiViewMixin } from '../../api/schema/schemaApiViewMixin.js';
import { View } from '../../vendors.js';
import { PropertiesListView } from './PropertiesListView.js';

export const PropertiesGroupView = View.extend({
	baseClassName: 'properties-group',
	template: '<header><%= groupName %></header>',
	children: [
		v => v.getTopView(),
		PropertiesListView,
		v => v.getBottomView()
	],
	...schemaApiViewMixin,
	initialize() {
		this.initializeSchemaData();
	},
	childViewOptions() {
		return { 
			schemaData: this.schemaData,
			editConfig: this.getOption('editConfig', true)
		}
	},
	templateContext() {
		return {
			groupName: this.getOption('groupName', true)
		}
	},
	childViewTriggers: {
		'user:input':'user:input',
		'property:validate': 'property:validate'
	},
	getTopView() {
		return this.getOption('topView', true);
	},
	getBottomView() {
		return this.getOption('bottomView', true);
	},

});