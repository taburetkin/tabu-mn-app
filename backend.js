import { invokeProp } from "../tabu-mn/utils/invokeValue.js";
import { registerClass } from "../tabu-mn/utils/knownClasses.js";
import { http } from "./http.js";

export class Backend {

	constructor(root) {
		this.root = root;
		this.headers = {};
	}

	sendAsync(options) { 
		options = this._normalizeOptions(options);		
		return http.sendAsync(options)
	}

	_normalizeOptions(options = {}) {
		const { headers = {}, replaceHeaders } = options;
		const actualHeaders = replaceHeaders ? headers : Object.assign({}, this.headers, headers);
		options = Object.assign({}, options, { headers: actualHeaders });
		return options;
	}

	replaceHeaders(headers) {
		this.headers = Object.assign({} , headers);
	}

	setHeaders(headers) {
		Object.assign(this.headers, headers);
	}

	setHeader(key, value) {
		this.headers[key] = value;
	}
}

registerClass(Backend);

export const entityBackendMixin = {

	fetchMethod: 'GET',
	deleteMthod: 'DELETE',
	createMethod: 'PUT',
	updateMethod: 'PATCH',

	async _sendBackendRequestAsync(options) {
		ensureBackend(this);
		options = this._normalizeBackendSendOptions(options);
		const { operation } = options;
		if (!this.backendOperations) { this.backendOperations = {}; }
		if (!this.backendOperations[operation]) { this.backendOperations[operation] = { count: 0 } }
		const op = this.backendOperations[operation];
		op.start = Date.now();
		op.end = undefined;
		const res = await this.backend.sendAsync(options);
		op.count++;
		op.end = Date.now();
		return res;
	},

	_normalizeBackendSendOptions(options) {
		const ownUrl = invokeProp(this, 'url', this, this);
		const optionsUrl = options.url;
		const url = normalizeUrl(ownUrl, optionsUrl, this.backend.root);
		options = Object.assign({}, options, { url });
		return options;
	},

	fetchAsync(options) { 
		const method = this.fetchMethod;
		options = Object.assign({ method, operation: 'fetch' }, options);
		return this._sendBackendRequestAsync(options);
	},

	deleteAsync() { 
		const method = this.deleteMethod;
		options = Object.assign({ method, operation: 'delete' }, options);
		return this._sendBackendRequestAsync(options);
	},

	updateAsync() { 
		const method = this.updateMethod;
		options = Object.assign({ method, operation: 'update' }, options);
		return this._sendBackendRequestAsync(options);
	},

	createAsync() {
		const method = this.createMethod;
		options = Object.assign({ method, operation: 'create' }, options);
		return this._sendBackendRequestAsync(options);
	}

}

function ensureBackend(_this) {
	if (!_this.backend) {
		throw new Error('backend singleton missing');
	}
}

function normalizeUrl(ownUrl, optionsUrl, rootUrl) {
	let absoluteOptionsUrl = isAbsoluteUrl(optionsUrl);
	if (absoluteOptionsUrl) { return optionsUrl; }
	let absoluteOwnUrl = isAbsoluteUrl(ownUrl);
	if (absoluteOwnUrl) {
		return joinUrlChunks(ownUrl, optionsUrl);
	}
	let url = joinUrlChunks(rootUrl, ownUrl, optionsUrl);
	if (!isAbsoluteUrl(url)) { 
		throw new Error('url must be an absolute url: ' + url);
	}

	return url;
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