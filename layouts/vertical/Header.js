import { View, CollectionView, request } from '../../vendors.js';
import './header.less';
import './breadcrumbs.less';
import { iconMixin } from '../../api/icons/iconMixin.js';
import { modals } from '../../api/index.js';
import { PageInfo } from './PageInfo.js';
import { PageLink } from './PageLink.js';

const Breadcrum = PageLink.extend({
	className: 'breadcrumb',
	nameSources: ['menuName', 'shortName', 'name'],
});

const Breadcrumbs = CollectionView.extend({
	className: 'breadcrumbs',
	initialize() {
		const subpagesRoot = getSubpagesRoot();
		let curPage = subpagesRoot || getPage();
		let page = curPage?.parent;
		if (!page) return;
		const models = [page.getLink()];
		
		page = page.parent;
		while (page) {
			const model = page.getLink();
			models.unshift(model);
			page = page.parent;
		}
		this.initializeCollection(models);
	},
	childView: Breadcrum,

});



const HeaderText = View.extend({
	className: 'header-text',	
	template: '<%= name %>',
	replaceParentContainer: true,
	templateContext() {
		return {
			name: this.getName()
		}
	},
	getName() {
		let p = getSubpagesRoot() || getPage();
		if (!p) return '';
		return p.getOption('name', true) || p.getOption('menuName', true);
	}
})


const HeaderNav = View.extend({
	tagName: 'nav',
	children: [
		Breadcrumbs
	]
})

const HeaderContainer = View.extend({
	//tagName: 'header',
	className: 'header-container',
	template: `
		<div class="left-container">
			<button class="app-btn main-menu"><span><span class="fa fa-bars"></span></span></button>
		</div>
		<section></section>
		<buttons></buttons>
	`,
	replaceParentContainer: true,
	considerChildViewKeyAs: 'selector',
	children: {
		section: HeaderText
	},
	triggers: {
		'click .main-menu':'show:menu'
	},
	onShowMenu() {
		modals.show(PageInfo, { noHeader: true, modalClassName: 'modal-page-info' });
	}
});


const Subpage = PageLink.extend({
	className: [
		'subpage',
		v => v.isRequested() ? 'requested' : ''
	],
	nameSources: ['subpagesName', 'menuName', 'shortName', 'name'],
	isRequested() { return !!this.model.get('isRequested'); }
});

const Subpages = CollectionView.extend({
	className: 'subpages',
	childView: Subpage,
	initialize() {
		const root = getSubpagesRoot();
		if (!root) { return; }
		const models = root.getChildren().map(p => p.getLink()).filter(f => !!f);
		models.unshift(root.getLink());		
		this.initializeCollection(models);		
	},
	onAttach() {
		this.scrollToRequested();
	},
	onRender() {
		this.scrollToRequested();
	},
	scrollToRequested() {
		console.log('scroll into', this.children._views)
		const found = this.children._views.filter(v => v.model.get('isRequested'))[0];
		console.log('scroll into view', found);
		if (!found) return;
		found.el.scrollIntoView({ inline: 'center' });
		console.log('scroll into view done');
	}	
});

export default View.extend({
	tagName: 'header',
	//template: '<nav></nav><div></div>',
	replaceParentContainer: true,
	children: [
		v => v.getHeaderNav(),
		HeaderContainer,
		v => v.getSubpages()
	],
	getHeaderNav() {
		if (!getPage()?.parent) { return; }
		return HeaderNav;
	},	
	getSubpages() {
		if (getSubpagesRoot()) {
			return Subpages;
		}
	}
});


function getPage() {
	return request.page;
}


function _getSubpagesRoot(page) {
	if (page && page.getOption('subpages', true)) {
		return page
	}
}

function getSubpagesRoot() {
	let p = getPage();
	if (!p) return;
	const root = _getSubpagesRoot(p);
	if (root) return root;
	return _getSubpagesRoot(p.parent);
}