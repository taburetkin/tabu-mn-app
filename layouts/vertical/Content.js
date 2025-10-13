import { View, CollectionView, request } from '../../vendors.js';
import { PageLink } from './PageLink.js';


const Children = CollectionView.extend({
	className: 'children-plates',
	childView: PageLink,
	childViewOptions() {
		return {
			className: 'page-plate',
			nameSources: ['name', 'menuName']
		}
	},
	initialize() {
		const models = this.getOption('models', true);
		this.initializeCollection(models);
	}
});



const UnderConstruction = View.extend({
	template: 'Страница временно не доступна, ведутся технические работы.'
});

export default View.extend({
	className: 'content',
	children() {
		if (!request.page) { return; }
		const page = request.page;
		const content = page.getOption('content', true);
		if (content) {
			return [content];
		}
		const root = page.getSubpagesRoot();
		if (!root || root !== page) {
			console.warn('proverka', page, root)
			const models = page.getChildren().map(p => p.getLink());
			if (models.length) {
				return [{ class: Children, models }]
			}

		} 
		return [UnderConstruction]
	}
});