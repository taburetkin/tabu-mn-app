import { registerClass, invokeProp, invokeValue } from "./vendors.js";
import { http } from "./http.js";
import { modals } from './api/modals/index.js';

export class Backend {

	constructor(root) {
		this.root = root;
		this.headers = {
			'Content-Type': 'application/json'
		};
	}

	sendAsync(options) { 
		options = this._normalizeOptions(options);		
		const promise = http.sendAsync(options);
		return promise;
	}

	_normalizeOptions(options = {}) {

		const body = normalizeBody(options);
		const headers = normalizeHeaders(this, options);
		if (options.showError) {
			const onFail = options.onFail;
			options.onFail = response => {
				modals.httpError(response);
				invokeValue(onFail, null, response);
			}
		}
		options = Object.assign({}, options, { headers, body });
		return options;
	}

	replaceHeaders(headers) {
		this.headers = Object.assign({} , headers);
	}

	setHeaders(headers) {
		Object.assign(this.headers, headers);
	}

	setHeader(key, value) {
		if (value == null) {
			delete this.headers[key];
		} else {
			this.headers[key] = value;
		}
	}


}

registerClass(Backend);

const startKey = Symbol('start');
const endKey = Symbol('end');

export const entityBackendMixin = {

	fetchMethod: 'GET',
	deleteMthod: 'DELETE',
	createMethod: 'PUT',
	updateMethod: 'PATCH',

	async sendAsync(options) {
		ensureBackend(this);
		options = this._normalizeBackendSendOptions(options);
		const { operation = 'undefined' } = options;
		if (!this.backendOperations) { this.backendOperations = {}; }
		if (!this.backendOperations[operation]) { this.backendOperations[operation] = { count: 0 } }
		const op = this.backendOperations[operation];
		const start = Date.now(); 
		this.backendOperations[startKey] = start;
		op.start = start;
		op.end = undefined;
		this.trigger('before:' + operation, this);
		const res = await this.backend.sendAsync(options);
		const end = Date.now();
		op.count++;
		op.end = end;
		this.backendOperations[startKey] = end;
		this.trigger(operation + ':complete', this);
		return res;
	},

	_normalizeBackendSendOptions(options = {}) {
		const url = normalizeUrl(this, options);
		options = Object.assign({}, options, { url });
		return options;
	},

	async fetchAsync(options) { 
		const method = this.fetchMethod;
		options = Object.assign({ method, operation: 'fetch' }, options);
		const result = await this.sendAsync(options);
		console.warn('fetch result', result);
		if (result.ok) {
			this.set(result.value);
		}
		return result;
	},

	deleteAsync() { 
		const method = this.deleteMethod;
		options = Object.assign({ method, operation: 'delete' }, options);
		return this.sendAsync(options);
	},

	updateAsync() { 
		const method = this.updateMethod;
		options = Object.assign({ method, operation: 'update' }, options);
		return this.sendAsync(options);
	},

	createAsync() {
		const method = this.createMethod;
		options = Object.assign({ method, operation: 'create' }, options);
		return this.sendAsync(options);
	},

	isFetching() {
		if (!this.backendOperations) { return false; }
		const start = this.backendOperations?.fetch?.start;
		const end = this.backendOperations?.fetch?.end;
		return start && !end;
	},

	isFetched() {
		if (!this.backendOperations) { return false; }
		const start = this.backendOperations?.fetch?.start;
		const end = this.backendOperations?.fetch?.end;
		const count = this.backendOperations?.fetch?.count || 0;
		return (start && end) && count > 0;
	},

	isIddle() {
		if (!this.backendOperations) { return true; }
		const bo = this.backendOperations;
		const start = bo[startKey];
		const end = bo[endKey];
		return (!start && !end) || (start && end);
	}

}

function ensureBackend(_this) {
	if (!_this.backend) {
		throw new Error('backend singleton missing');
	}
}

function normalizeUrl(model, options = {}) {
	
	const { operation, url: optionsUrl } = options;
	//let { optionsUrl, ownUrl, urlRoot, backendRoot } = options;

	// если в опциях передан абсолютный урл то используем его
	let absoluteOptionsUrl = isAbsoluteUrl(optionsUrl);
	if (absoluteOptionsUrl) { return optionsUrl; }

	let operationUrl;
	if (operation) {
		operationUrl = invokeProp(model, operation + 'Url', model, model);
		let urlRoot = invokeProp(model, 'urlRoot', model, model);
		if (urlRoot && !isAbsoluteUrl(operationUrl)) {
			operationUrl = joinUrlChunks(urlRoot, operationUrl);
		}
	}
	// if (isAbsoluteUrl(operationUrl)) {
	// 	return operationUrl;
	// }
	let backendRoot = model.backend.root;
	const ownUrl = operationUrl || invokeProp(model, 'url', model, [model, operation]);
	let absoluteOwnUrl = isAbsoluteUrl(ownUrl);
	if (absoluteOwnUrl) {
		return joinUrlChunks(ownUrl, optionsUrl);
	} else if (ownUrl) {
		return joinUrlChunks(backendRoot, ownUrl, optionsUrl);
	} else if (optionsUrl) {
		return joinUrlChunks(backendRoot, optionsUrl);
	}



	// let root;
	// let urlRoot = invokeProp(model, 'urlRoot', model, [model, operation]);
	// if (ownUrl) {
	// 	if (isAbsoluteUrl(urlRoot)) {
	// 		root = urlRoot;
	// 	} else {
	// 		root = joinUrlChunks(backendRoot, urlRoot);
	// 	}
	// } else {
	// 	root = backendRoot;
	// }

	// if (!ownUrl) {
	// 	return joinUrlChunks(root, optionsUrl);
	// }

	// return joinUrlChunks(root, ownUrl, optionsUrl);

	// let url = joinUrlChunks(rootUrl, ownUrl, optionsUrl);
	// if (!isAbsoluteUrl(url)) { 
	// 	throw new Error('url must be an absolute url: ' + url);
	// }

	// return url;
}

function isAbsoluteUrl(url) {
	if (url == null) return;
	if (url.startsWith('http') || url.startsWith('//')) { return true; }
	return false;
}

function joinUrlChunks(...chunks) {
	const url = chunks.reduce((url, chunk) => {
		if (url === '') { return chunk; }
		if (chunk === '' || chunk == null) { return url; }
		const endSlash = url.endsWith('/');
		const startSlash = chunk.startsWith('/');
		const addSlash = !endSlash && !startSlash ? '/' : '';
		if (endSlash && startSlash) {
			chunk = chunk.substring(1);
		}
		url += addSlash + chunk;
		return url;
	}, '');
	return url;
}


function normalizeBody(options) {
	let { body, attrs, data } = options;
	let arg = body || data || attrs;
	if (arg) {
		return typeof arg === 'string' ? arg : JSON.stringify(arg);
	}
}

function normalizeHeaders(backend, options) {
		const { headers = {}, replaceHeaders } = options;
		const actualHeaders = replaceHeaders ? headers : Object.assign({}, backend.headers, headers);
		return actualHeaders;
}