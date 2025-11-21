import { singleSelectMixin } from '../../api/collection/singleSelectMixin.js';
import { claimsApi } from '../../api/index.js';
import { ButtonView } from '../../ButtonView.js';
import { View, CollectionView, Collection, smartNavigate } from '../../vendors.js';
import { actorClaims } from '../../singletons/actorClaims.js';
import { pagesLinks } from '../../singletons/pagesLinks.js';
import { actorInfo } from '../../singletons/actorInfo.js';

const SelectCollection = Collection.extend({
	...singleSelectMixin,
});

const Group = View.extend({
	baseClassName: 'content-group',
	template: '<label><%= name %></label>',
	templateContext() {
		return {
			name: this.getOption('name', true)
		}
	}
})

const SignButton = ButtonView.extend({
	className: 'sign-btn default',
	icon: 'fa:sign-in',
	text: 'войти',
	action() {
		console.log('????', pagesLinks.login);
		return smartNavigate(pagesLinks.login);
	}
});

const Anonymous = View.extend({
	className: 'element',
	template: 'Вход не выполнен',
	children: [
		SignButton
	]
});

const Account = View.extend({
	className: 'element',
	template: '<a href="<%= profilePage %>"><%= displayName %></a>',
	initialize() {
		this.model = actorInfo;
	},
	templateContext() {
		return {
			profilePage: pagesLinks.profile
		}
	}
});

const Info = Group.extend({
	name: 'аккаунт',
	children: [
		v => isAuthorized() ? Account : Anonymous
	]
});


const Links = Group.extend({
	name: 'ссылки',
	children: [
		{ class: View, className: 'element', template: 'нет запомненных ссылок' },
	]
});

const version = '1.0.0';
const App = Group.extend({
	name: 'приложение',
	children: [
		{ class: View, className: 'element', template: 'версия: ' + version },
		{ class: View, className: 'element', 
			children:  [{ class: ButtonView, className: 'default', text: 'сбросить кэш' }]
		},
		
	]
});

const SearchItem = View.extend({
	className: 'element',
});

const SearchVariant = View.extend({
	className: [
		'variant',
		v => v.model.collection.isSelected(v.model) ? 'selected' : ''
	],
	modelEvents: { 'select': 'updateClassName' },
	template: '<%= name %>',
	triggers: { click: 'click' }
});

const SearchVariants = CollectionView.extend({
	className: 'variants',
	childView: SearchVariant,
	childViewEvents: {
		click(v,e) {
			this.collection.select(v.model);
			console.log('shpok', v.model)
		}
	}
});

const InputContainer = View.extend({
	className: 'search-input',
	template: '<input type="text" /><button><div><span class="fa fa-search"></span></div></button>',
});


const SearchElement = View.extend({
	className: 'variative-text-search',
	passDownCollection: true,
	Collection: SelectCollection,
	initialize() {
		const models = [
			{ name: 'процессы' },
			{ name: 'клиенты' },
			{ name: 'недвижимость' }
		]
		this.initializeCollection(models);
	},
	children: [
		SearchVariants,
		InputContainer
	],
	onRender() {
		const model = this.collection.first();
		this.collection.select(model);
	}
});

const Search = Group.extend({
	name: 'поиск',
	childView: SearchItem,
	children: [
		{ 
			class: View, className: 'element',
			children: [ SearchElement ]
		},
	]
});



export const Fast = View.extend({
	className: 'fast-container',
	children: [
		Info,
		v => isAuthorized() && Search,
		v => isAuthorized() && Links,
		App,
	],
});


function isAuthorized() {
	return claimsApi.has(actorClaims.getClaims(), { authorized: true });
}