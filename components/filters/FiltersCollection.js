import { Collection } from '../../vendors.js';
import { FilterItemModel } from './filter-item/FilterItemModel';
import { errResult, okResult } from '../../async';
export const FiltersCollection = Collection.extend({
	model: FilterItemModel,
	async initializeAsync() {
		if (this._initialized) {
			return okResult(this);
		}
		try {
			const res = await this.fetchAsync();
			if (!res.ok) { return res; }
			return okResult(this);
		} catch(exc) {
			return errResult(exc);
		}
	},
	parse(data) {
		console.error('PARSE')
		const models = Object.keys(data).map(id => Object.assign({ id, property: id }, data[id]));
		return models;
	}
});