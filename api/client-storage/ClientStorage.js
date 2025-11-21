import { clientStorageApi } from "./clientStorageApi.js";

export class ClientStorage {

	constructor(arg, single) {
		this.api = clientStorageApi;
		const typeofArg = typeof arg;
		if (typeofArg === 'string') {
			this.rootKey = arg;
		} else if (arg && typeofArg === 'object') {
			this.rootKey = arg.rootKey;
		} else {
			this.rootKey = '';
		}
		if (single === true) {
			this.single = true;
		}
	}

	get(key, insession) {
		if (this.single) {
			insession = key;
			key = this.rootKey;
		}
		// key = this._normalizeKey(key);
		// insession = this._normalizeInsession(key, insession);
		return this.api.get(key, insession);
	}

	set(key, value, insession) {
		if (this.single) {
			insession = value;
			value = key;
			key = this.rootKey;
		}
		// key = this._normalizeKey(key);
		// insession = this._normalizeInsession(key, value, insession);
		return this.api.set(key, value, insession);
	}

	remove(key, insession) {
		if (this.single) {
			insession = value;
			value = key;
			key = this.rootKey;
		}
		// key = this._normalizeKey(key);
		// insession = this._normalizeInsession(key, insession);
		return this.api.remove(key, insession);
	}

	// _normalizeKey(arg) {
	// 	if (this.single) {
	// 		return this.rootKey;
	// 	}
	// 	const key = (this.rootKey ? this.rootKey + '/' : '') + arg;
	// 	return key;		
	// }

	// _normalizeInsession(arg1, arg2, arg3) {

	// 	// only in set
	// 	if (arguments.length === 3) {
	// 		return arg3;
	// 	}

	// 	if (arg2 != null) {
	// 		return arg2;
	// 	}

	// 	if (typeof arg1 === 'boolean' || arg1 === 'both') {
	// 		return arg1;
	// 	}
	// }


}