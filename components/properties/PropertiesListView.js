import { schemaApiViewMixin } from '../../api/schema/schemaApiViewMixin.js';
import { CollectionView } from '../../vendors.js';
import { PropertyView } from './PropertyView.js';

export const PropertiesListView = CollectionView.extend({
	baseClassName: 'properties-list',
	childView: PropertyView,
	...schemaApiViewMixin,
	initialize() {
		this.initializeSchemaData();
		this.collection = this.schemaData.schemaCollection;
		
	},
	viewFilter(v) {
		if (!this.schemaProperties) { return true; }
		return this.schemaProperties.indexOf(v.model.id) > -1;
	},
	childViewOptions(model) {
		return {
			schemaData: this.schemaData,
			schemaProperty: model.id
		}
	}
});