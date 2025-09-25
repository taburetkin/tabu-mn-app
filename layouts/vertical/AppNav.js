import { Collection, CollectionView, Model, request, View } from '../../vendors.js';
import { PageLink } from './PageLink.js';
import './app-nav.less';

const NavPageLink = PageLink.extend({
	className: [
		'app-nav-page-link',
		v => v.model.get('isRequested') ? 'current' : undefined,
		v => v.model.get('isParentOfRequested') ? 'parent-of-current' : undefined,
	],
	nameSources: ['menuName', 'name']
});


const TreeItemChildren = CollectionView.extend({
	className: 'app-nav-tree-item-children',
	initialize(options) {
		this.mergeOptions(options, ['page', 'pageChildren']);
		const models = this.pageChildren.map(child => Object.assign({ page: child }, child.getLink()));
		this.initializeCollection(models);
	},
	childView() {
		return TreeItem;
	},

})

const TreeItem = View.extend({
	className: [
		'app-nav-tree-item',
	],
	initialize() {
		this.page = this.model.get('page'); // this.mergeOptions(options, ['page']);
		this.pageChildren = this.page.getChildren();
		console.log(this.model.attributes, { page: this.page, children: this.pageChildren })
	},
	childViewOptions() {
		return {
			model: this.model,
			page: this.page,
			pageChildren: this.pageChildren
		}
	},
	children() {
		return [
			NavPageLink,
			this.pageChildren.length ? TreeItemChildren : undefined
		];
	}
})

const TreeView = View.extend({
	className: 'app-nav-tree',
	initialize() {
		const root = request.page?.rootPage;
		if (!root) return;
		this.root = root;
	},
	children() {
		if (!this.root) return;
		const page = this.root;
		const pageChildren = page.getChildren();
		return [
			{ class: TreeItemChildren, page, pageChildren, isRoot: true }
		];
	}
})

export const AppNav = View.extend({
	className: 'app-nav',
	children: [
		TreeView
	]
})