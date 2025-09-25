export function isPrimitive(value) {
	// at this point arrays should be ignored. maybe later this will be reimplemented based on provided options
	if (!value) return true;
	const typeValueOf = typeof value.valueOf();
	return typeValueOf !== 'object';
}

export function flatObject (arg, options = {}) {
	let { path = [], root, transformValue } = options;

	options = Object.assign({}, options, { path, root });

	arg = transformValue ? transformValue(arg) : arg;

	const apply = root ? v => {
		root[path.join('.')]  = v;
	} : undefined;

	if (isPrimitive(arg)) {
		if (apply) { apply(arg); }
		return arg;
	} else if (Array.isArray(arg)) {
		const { newArray } = options;
		const arr = newArray ? newArray(arg) : [];
		options = Object.assign({}, options, { root: undefined, path: undefined})
		for(let el of arg) {
			const newel = flatObject(el, options);
			arr.push(newel);
		}

		if (apply) { apply(arr); }

		return arr;

	} else {
		const { newObject } = options;
		root = root || (newObject ? newObject(arg) : {});
		options = Object.assign({}, options, { root });
		for (let key in arg) {
			const value = arg[key];
			path.push(key);

			flatObject(value, options);

			path.pop();
		}

		return root;

	}
}

