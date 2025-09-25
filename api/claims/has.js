import { isAllMethod } from "./symbols";

export function hasClaims(actor, expected) {
	if (expected == null) { return true; }

	let type = typeof expected;
	if (type !== 'object') { throw new Error('unexpected claim value') }

	let isAny, isAll;

	if (Array.isArray(expected)) {
		isAll = isAllMethod(expected) ? true : false;
		isAny = !isAll;
		for(let group of expected) {
			let result = hasClaims(actor, group);
			if ((isAny && result) || (isAll && !result)) { return result; }
		}
		return isAll;
	}

	isAll = true;
	isAny = !isAll;
	for(let key in expected) {
		let expectedValue = expected[key];
		let result = hasClaimValue(actor, key, expectedValue);
		if ((isAny && result) || (isAll && !result)) { return result; }
	}

	return isAll;
	

}

function hasClaimValue(actor, key, expectedValue) {
	if (Array.isArray(expectedValue)) {
		let isAll = isAllMethod(expectedValue) ? true : false;
		let isAny = !isAll;
		for(let arrayKey of expectedValue) {
			let result = hasClaimValue(actor, key + '.' + arrayKey, true);
			if ((isAny && result) || (isAll && !result)) { return result; }
		}
		return isAll;
	}
	let keyExist = key in actor;
	let actorValue = actor[key];
	let result = expectedValue ? actorValue === expectedValue 
										: keyExist ? actorValue === expectedValue 
														: true;

	return result;
}