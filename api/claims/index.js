import { hasClaims } from "./has";
import { flatObject, isPrimitive } from "../../utils/objects/flatObject.js";
import { setAllMethod, isAllMethod } from "./symbols.js";

export const claimsApi = {

	has(actorClaims, expectedClaims) {

		const normalizedActorClaims = this._normalizeUserClaims(actorClaims);
		const normalizedExpectedClaims = this._normalizeExpectedClaims(expectedClaims);

		const result = hasClaims(normalizedActorClaims, normalizedExpectedClaims);

		return result;
	},

	_hasClaims(actor, expected) {
		if (expected == null) return true;
		const isArray = Array.isArray(expected);
		const enumerableKeys = isArray ? expected : Object.keys(expected);
		const isAll = isArray ? isAllMethod(expected) : true;
		const isAny = !isAll;

		for(let i = 0; i < enumerableKeys.length; i++) {
			let key = isArray ? i : enumerableKeys[i];
			let expectedValue = expected[key];
			//let typeValue = typeof expectedValue;
			let result;
			if (expectedValue === true) {
				result = actor[key] === expectedValue;
			} else if (expectedValue === false) {
				result = (key in actor === false) || (actor[key] === false);
			} else if (Array.isArray(expectedValue))

			if ((isAll && !result) || (isAny && result)) { return result; }
		}

		return isAll;
	},

	_normalizeUserClaims(claims) {
		const res = flatObject(claims, {
			transformValue: transformValueFlatArray,
			newArray,
		});

		return res;
	},

	_normalizeExpectedClaims(claims) {
		const res = flatObject(claims, {
			transformValue: transformValue,
			newArray,
		});

		return res;
	}

}



function newArray(arg) {
	const arr = [];
	if (isAllMethod(arg)) {
		setAllMethod(arr);
	}
	return arr;
}

function transformValue(arg) {
	if (arg === 1) { return true; }
	if (arg === 0 || arg === '') { return false; }
	if (typeof arg === 'string' && arg.indexOf(',') > -1) {
		const res = arg.split(/\s*,\s*/);
		setAllMethod(res);
		return res;
	}
	return arg;
}

function transformValueFlatArray(arg) {
	arg = transformValue(arg);
	if (Array.isArray(arg) && arg.every(i => isPrimitive(i))) {
		return arg.reduce((m,e) => {
			m[e] = true
			return m;
		}, {})
	}
	return arg;
}