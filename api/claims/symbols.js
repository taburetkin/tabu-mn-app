export const methodKeySymbol = Symbol('method');

export const METHODS = {
	ALL: 'all',
	ANY: 'any'
}

export const METHODSVALUES = Object.keys(METHODS).reduce((memo, id) => {
	memo[METHODS[id]] = 1
	return memo;
}, {});

export function setAllMethod(arg) {
	arg[methodKeySymbol] = METHODS.ALL;
}

export function isAllMethod(arg) {
	return arg[methodKeySymbol] === METHODS.ALL;
}

// export const typeKeySymbol = Symbol('type');



// export const TYPES = {
// 	GROUP: 'group',
// 	VALUES: 'values'
// }

// export const TYPESVALUES = Object.keys(TYPES).reduce((memo, id) => {
// 	memo[TYPES[id]] = 1
// 	return memo;
// }, {});



// export function setType(arg, type, force) {
// 	if (type in TYPESVALUES && (typeKeySymbol in arg === false || force)) {
// 		arg[typeKeySymbol] = type;
// 	}
// }

// export function getType(arg) {
// 	return arg[typeKeySymbol];
// }

// export function getMethod(arg) {
// 	return arg[methodKeySymbol];
// }

// export function setMethod(arg, method, force) {
// 	if (method in METHODSVALUES && (methodKeySymbol in arg === false || force)) {
// 		arg[methodKeySymbol] = method;
// 	}
// }

// export function hasTypeDefined(arg, type) {
// 	if (!type) {
// 		return typeKeySymbol in arg;
// 	} else {
// 		return arg[typeKeySymbol] === type;
// 	}
// }

