import { View, CollectionView, request } from '../../vendors.js';
import { iconMixin } from '../../api/icons/iconMixin.js';

export const PageLink = View.extend({
	...iconMixin,
	template: '<a href="<%= href %>"><%= iconHtml %><span class="link-name"><%= name %></span></a>',
	icon: v => v.model.get('icon'),
	getName() {
		if (!this.nameSources) {
			throw new Error('please define nameSources property ["property1", "property2", ... ]');
		}
		for(let key of this.nameSources) {
			const name = this.model.get(key);
			if (name) return name;
		}
	},
	templateContext() {
		const iconHtml = this.getIconHtml()
		const _name = this.getName();
		const name = this.model.get('href') === '/' ? '' : _name;
		return {
			iconHtml,
			name
		}
	}
})