import { Model } from '../../vendors.js';

export function getByPath(obj, path, options) {
	if (obj instanceof Model) {
		obj = obj.attributes;
	}
	const pathChunks = path.split('.');
	while(pathChunks.length) {
		if (obj == null) return;
		let chunk = pathChunks.shift();
		if (chunk in obj === false) return;
		obj = obj[chunk];

		if (!pathChunks.length) {
			return obj;
		}
	}
}

export function setByPath(obj, path, value, options) {
	if (obj == null) { return; }
	let model;
	if (obj instanceof Model) {
		model = options?.silent !== true ? obj : undefined;
		obj = obj.attributes;
	}

	const pathChunks = path.split('.');
	const propertyName = pathChunks.pop();
	const changes = [];
	const processedChunks = [];
	while(pathChunks.length) {
		
		let chunk = pathChunks.shift();
		processedChunks.push(chunk);
		let nested = obj[chunk];
		if (nested == null || typeof nested !== 'object') {
			nested = {};
			obj[chunk] = nested;
			changes.push({ path: processedChunks.join('.'), value: nested });
		}
		obj = nested;
	}

	obj[propertyName] = value;
	changes.push({ path, value });

	if (model) {
		while(changes.length) {
			let change = changes.pop();
			model.trigger('change:' + change.path, model, change.value);
		}
		model.trigger('change', model);
	}
	
}
