import { View, CollectionView, Collection, request } from '../../vendors.js';
import { iconMixin } from '../../api/icons/iconMixin.js';
import './page-info.less';
import { ButtonView } from '../../ButtonView.js';
import { AppInfo } from './AppInfo.js';
import { AppNav } from './AppNav.js';


const predefinedTabs = {
	tree: { id: 'nav', name: 'навигация', icon:'fa:folder-tree', view: AppNav },
	info: { id: 'info', name: 'приложение', icon:'fa:circle-info', badge: 127, view: AppInfo }
};

const TabTriggerView = View.extend({
	...iconMixin,
	baseClassName: 'tab-trigger',
	className: [
		v => v.isActive() ? 'active' : ''
	],
	template: `<%= iconHtml %><span class="tab-name"><%= name %></span><%= badgeHtml%>`,
	icon: v => v.model.get('icon'),
	templateContext() {
		return {
			iconHtml: this.getIconHtml(),
			badgeHtml: this.getBadgeHtml(),
		}
	},
	getBadgeHtml() {
		const badge = this.model.get('badge');
		if (badge == null) return '';
		return `<span class="badge"><span>${badge}</span></span>`;
	},
	isActive() {
		return this.model === this.model.collection.active;
	},
	modelEvents: {
		'active':'updateClassName'
	},
	triggers: {
		click:'tab:trigger'
	}
});


const TriggersCollection = Collection.extend({

	setActive(model) {
		if (this.active) {
			let active = this.active;
			delete this.active;
			active.trigger('active', active, false);
		}
		if (model) {
			this.active = model;
			model.trigger('active', model, true);		
		}
	},
	initializeActiveTab() {
		let model = this.first();
		this.setActive(model);
	},

});


const TabTriggersView = CollectionView.extend({
	name: 'triggersView',
	className: 'tab-triggers',
	childView: TabTriggerView,
	// initialize() {
	// 	const models = this.getModels();
	// 	this.initializeCollection(models);
	// 	this.initializeActiveTab();
	// },


	// setActive(model) {
	// 	if (this.collection.active) {
	// 		let active = this.collection.active;
	// 		delete this.collection.active;
	// 		active.trigger('active', active, false);
	// 	}
	// 	this.collection.active = model;
	// 	model.trigger('active', model, true);
	// },
	childViewEvents: {
		'tab:trigger'(v) {
			console.log('chpok?', v.model)
			if (this.collection.active === v.model) return;
			this.collection.setActive(v.model);
		}
	}
});

const TabContentView = View.extend({
	name: 'tabContentView',
	className: 'tab-content',
	collectionEvents: {
		active(tab, shouldShow) {
			console.warn(tab, shouldShow);
			if (shouldShow) {
				this.render();
			}
		}
	},
	children() {
		if (!this.collection.active) return;
		let tab = this.collection.active;
		let view = tab.get('view');
		if (view) { return [view] }
	}
})

export const PageInfo = View.extend({
	className: 'page-info',
	initialize() {
		const models = this.getTriggersModels();
		this.triggersCollection = new TriggersCollection(models);
		this.triggersCollection.initializeActiveTab();
	},
	getTriggersModels() {
		const models = [
			// {name: 'tab1' },
			// {name: 'tab2' },
			// {name: 'tab3' },
			// {name: 'tab4' },
			// {name: 'tab5' },
			// {name: 'tab6' },
			// {name: 'tab7' },
		];
		models.push(predefinedTabs.tree);
		models.push(predefinedTabs.info);
		return models;
	},
	childViewOptions() {
		return {
			collection: this.triggersCollection
		}
	},
	children: [
		v => ({class: ButtonView, icon: 'fa:x', className: 'close', onActionSuccess: btn => v.triggerMethod('modal:close') }),
		TabTriggersView,
		TabContentView
	]
})