import { CollectionView } from 'core';
import { FilterItemView } from './filter-item/FilterItemView';
export const FiltersView = CollectionView.extend({
	childView: FilterItemView,
	
});