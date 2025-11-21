import { request, invokeProp } from './vendors.js';
import { AppObject } from './AppObject.js'
import { errResult } from "./async.js";
import { claimsApi, requestApi } from "./api/index.js";
import { actorClaims } from "./singletons/actorClaims.js";

const paramPattern = /\:([\w_-]+)/gmi;

export const Page = AppObject.extend({

	constructor: function Page(options) {
		this._setOptions(options);
		this.mergeOptions(options, ['id', 'parent', 'beforeStart', 'beforeStop']);
		this._initialchildren = this.getOption('children', false);
		this.rootPage = this.parent ? this.parent.rootPage : this;
		AppObject.apply(this, arguments);
		this._initializeRoute();
		if (!this.id) {
			this.id = this.route;
		}
		this._initializeChildren();
	},

	_initializeRoute() {
		const route = this.getOption('route', true);
		if (route != null) {
			const add = this.parent?.route ? this.parent.route + '/' : '';
			this.route = add + route;
		}
		if (/\:([\w_-]+)/gmi.test(this.route)) {
			const routeParameters = [];
			const matches = this.route.matchAll(/\:([\w_-]+)/gmi);
			for(let match of matches) {
				//console.log('*', match);
				routeParameters.push(match[1]);
			}
			this.routeParameters = routeParameters;
		}
		// console.log('-route-', this.getOption('route', true), this.route, this.routeParameters, this);
		// console.log('-url-', this.getUrl())
	},

	_initializeChildren() {
		
		if (this._childrenInitialized) { return; };
		this.children = [];
		this._childrenInitialized = true;

		const children = invokeProp(this, '_initialchildren');
		if (!children || typeof children !== 'object') { return; }
		
		const childPageOptions = this.getOption('childPageOptions', true);
		const ChildClass = this.getOption('childPageClass', true);
		for(let route in children) {
			const child = this._buildChildPage({ class: ChildClass, app: this.app }, childPageOptions, children[route], { route, parent: this });
			this.children.push(child);
		}

	},

	_buildChildPage(...args) {
		const options = Object.assign(...args);
		const PageClass = invokeProp(options, 'class') || this.getOption('class', true) || Page;
		return new PageClass(options);
	},

	_getChildren(predicate) {
		const arr = [];
		for(let child of this.children) {
			if (!predicate || predicate(child))
				arr.push(child);
		}
		return arr;
	},

	getChildren(predicate) {
		if (predicate === undefined) {
			predicate = child => {
				const error = child.getClaimsError('navigate');
				//console.log(' child predicate: navigate claims:', error);
				if (error) return false;
				const u = child._getUrl();
				//console.log(' child predicate: url:', u);
				
				return u.noMissingParameters === true;
			}
		}
		return this._getChildren(predicate);
	},

	_getUrl(args) {

		if (args == null) {
			args = request.args || {};
		}

		let notEnoughArguments;
		let index;
		let missingParameters = [];
		let existParameters = [];
		let url = this.route.replace(/\(*\/*:([\w_-]+)\)*/gmi, (m, f, i) => {
			
			let optional = m.endsWith(')');
			let addslash = /\/:/.test(m) ? '/' : '';
			let missing;
			if (f in args === false) {
				if (index == null) {
					index = i;
				}
				missing = true;
				missingParameters.push(f);
			} else {
				existParameters.push(f);
			}

			if (!optional && missing) {
				notEnoughArguments = true;
			}
			let value = args[f] || '';
			
			return value ? addslash + value 
							: optional ? '' : m;
		});

		if (!url.startsWith('/')) {
			url = '/' + url;
		}

		const u = {
			url,
			index,
			_url: url.substring(0, index),
			missingParameters,
			existParameters,
			notEnoughArguments,
			noMissingParameters: missingParameters.length === 0,
			parameterless: missingParameters.length === 0 && existParameters.length === 0
		}

		return u;
	},

	getUrl(args, { force } = {}) {
		const error = this.getClaimsError('navigate');
		if (!force && error) {
			console.error(error);
			return null;
		}
		if (!force && this.getOption('isHidden', true)) {
			return null;
		}
		const u = this._getUrl(args);
		if (u.noMissingParameters) {
			return u.url;
		}
	},
	
	getLink(args, options) {
		let url = this.getUrl(args, options);
		if (url == null) return;
		
		const isRequested = requestApi.isRequested(this);
		const isParentOfRequested = !isRequested && requestApi.isParentOfRequested(this);
		const link = Object.assign(
			{ href: url, isRequested, isParentOfRequested },
			this.getOptions(['name', 'menuName', 'shortName', 'subpagesName', 'icon', 'model', 'collection', 'description'], true)
		);
		return link;
	},

	beforeStop() { },

	async _beforeStopAsync() {
		
		let res = await this.asyncResult(() => this.beforeStop());
		if (!res.ok) { return res; }
		res = await this.triggerMethodAsync('before:stop', this);
		return res;
	},

	async stopAsync() {
		const res = await this._beforeStopAsync();
		if (res.ok) {
			this.triggerMethod('stop', this, res.value);
		}
		return res;
	},


	beforeStart(args) { },

	async _beforeStartAsync(args) {

		const error = this.getStartError()
		if (error) {
			return errResult(error);
		}

		let res;
		res = await this.asyncResult(() => this.beforeStart(args));
		if (!res.ok) { return res; }
		res = await this.triggerMethodAsync('before:start', this, args);
		return res;
	},

	async startAsync(args) {
		const res = await this._beforeStartAsync();
		if (res.ok) {
			this.triggerMethod('start', this, args);
		} else {
			this.triggerMethod('start:fail', this, res.value);
		}
		return res;
	},

	getStartError() {
		let error;
		error = this.getClaimsError();
		if (error) {
			return error;
		}
	},

	getClaimsError(purpose) {
		const userClaims = this.getUserClaims();
		const expectedClaims = this.getClaims(purpose);
		const claimsIsOk = claimsApi.has(userClaims, expectedClaims);
		if (!claimsIsOk) {
			purpose = purpose || 'start';
			let error = this.getOption(purpose + 'ClaimsErrorMessage', true);
			if (error) { return error; }
			if (userClaims.authorized || userClaims.authenticated) {
				return 'forbidden';
			} else {
				return 'notAuthorized';
			}
		}
	},

	getUserClaims() {
		return actorClaims.getClaims();
	},

	getClaims(purpose) {
		if (purpose === 'navigate') {
			let claims = this.getOption('navigateClaims', true);
			if (claims != null) {
				return claims;
			}
		}
		return this.getOption('startClaims', true);
	},

	getSubpagesRoot() {
		return _getSubpagesRoot(this) || _getSubpagesRoot(this.parent);
	}

});

function _getSubpagesRoot(page) {
	if (!page) { return; }
	return page.getOption('subpages', true) ? page : undefined;
}

