import { View, CollectionView } from '../../../vendors.js';
import { InputView } from '../Input.js';

export const SelectLabelView = View.extend({
	baseClassName: 'select-label',
	template: '<%= label %>'
});

export const SelectItemView = View.extend({
	baseClassName: [
		'select-list_option',
	],
	template: '<span class="select-icon"></span><div class="select-label-container"></div>',
	childrenContainer: '.select-label-container',
	initialize() {
		this.multiple = this.model.collection.multiple;
	},
	children() {
		const view = this.getOption('labelView', true) || SelectLabelView;
		return [view];
	}
})

export const SelectItemsView = CollectionView.extend({
	childView: SelectItemView,
});

const SearchInputView = InputView.extend({
	schemaData: {
		schemaModel: {},
		modelSchema: { }
	},
	valueSchema: {
		id: 'search',
		valueType: 'string'
	}
})

const SearchView = View.extend({
	children:[
		SearchInputView
		//{ class: InputView, schemaData } //inputType: 'text', inputName: 'search' }
	]
});

const SegmentsView = View.extend({

});

export const Select = View.extend({
	children() {
		const search = this.getSearch();
		const segments = this.getSegments();
		const list = this.getList();
		const views = [
			search, segments, list
		];
		return views;
	},
	getSearch() {
		return SearchView;
	},
	getSegments() {
		return SegmentsView;
	},
	getList() {
		return SelectItemsView;	
	}
});