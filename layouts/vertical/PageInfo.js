import { View, CollectionView, Collection, request } from '../../vendors.js';
import { iconMixin } from '../../api/icons/iconMixin.js';
import './page-info.less';
import { ButtonView } from '../../ButtonView.js';
import { AppInfo } from './AppInfo.js';
import { AppNav } from './AppNav.js';
import { Fast } from './Fast.js';
import { singleSelectMixin } from '../../api/collection/singleSelectMixin.js';


const predefinedTabs = {
	fast: { id: 'fast', name: '', icon: 'fa:circle-info', view: Fast },
	tree: { id: 'nav', name: 'навигация', icon:'fa:folder-tree', view: AppNav },
	//info: { id: 'info', name: 'приложение', icon:'fa:circle-info', badge: 127, view: AppInfo }
};

const TabTriggerView = View.extend({
	...iconMixin,
	baseClassName: 'tab-trigger',
	className: [
		v => v.isActive() ? 'active' : ''
	],
	template: `<%= iconHtml %><span class="tab-name button-text"><%= name %></span><%= badgeHtml%>`,
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
		return `<span class="button-badge"><span>${badge}</span></span>`;
	},
	isActive() {
		return this.model.collection.isSelected(this.model);
	},
	modelEvents: {
		'active':'updateClassName'
	},
	triggers: {
		click:'tab:trigger'
	}
});


const TriggersCollection = Collection.extend({

	...singleSelectMixin,
	selectModelEvent: 'active',
	initializeActiveTab() {
		let model = this.first();
		this.select(model);
	},

});


const TabTriggersView = CollectionView.extend({
	name: 'triggersView',
	className: 'tab-triggers',
	childView: TabTriggerView,

	childViewEvents: {
		'tab:trigger'(v) {
			if (this.collection.isSelected(v.model)) return;
			this.collection.select(v.model);
		}
	}
});

const TabContentView = View.extend({
	name: 'tabContentView',
	className: 'tab-content',
	collectionEvents: {
		active(tab, shouldShow) {
			if (shouldShow) {
				this.render();
			}
		}
	},
	children() {
		let tab = this.collection.selected();
		if (!tab) return;
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
			predefinedTabs.fast,
			predefinedTabs.tree,
			//predefinedTabs.info
		];
		// models.unshift(predefinedTabs.fast);
		// models.unshift(predefinedTabs.tree);
		// models.push(predefinedTabs.info);
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