import { View, CollectionView, request } from '../../vendors.js';
import { AppNav } from './AppNav.js';
import { PageInfo } from './PageInfo.js';

const Child = View.extend({
	template: '<a href="<%= href %>"><span><%= name %></span></a>',
	templateContext() {
		return {
			name: this.model.get('name') || this.model.get('menuName')
		}
	}
});

const Children = CollectionView.extend({
	childView: Child,
	initialize() {
		const page = request.page;
		if (!page) return;
		const models = page.getChildren().map(p => p.getLink()).filter(f => !!f);
		this.initializeCollection(models);
	}
});

export default View.extend({
	className: 'content',
	children: [
		PageInfo
	]
});