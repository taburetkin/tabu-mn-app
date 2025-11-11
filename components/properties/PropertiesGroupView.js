import { schemaApiViewMixin } from '../../api/schema/schemaApiViewMixin.js';
import { View } from '../../vendors.js';
import { PropertiesListView } from './PropertiesListView.js';

export const PropertiesGroupView = View.extend({
	baseClassName: 'properties-group',
	template: '<header><%= groupName %></header>',
	children: [PropertiesListView],
	...schemaApiViewMixin,
	initialize() {
		this.initializeSchemaData();
	},
	childViewOptions() {
		return { schemaData: this.schemaData }
	},
	templateContext() {
		return {
			groupName: this.getOption('groupName', true)
		}
	}
});