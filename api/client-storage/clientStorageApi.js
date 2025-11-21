export const clientStorageApi = {

	getItem(key, inSession) {
		return store(inSession).getItem(key);
	},
	
	setItem(key, value, inSession) {
		return store(inSession).setItem(key, value);
	},



	get(key, inSession) {
		const jsonString = this.getItem(key, inSession);
		if (jsonString == null) { return jsonString; }
		const value = JSON.parse(jsonString);
		return value;
	},

	set(key, value, inSession) {
		if (value == null) {
			return this.remove(key, inSession);
		}
		const jsonString = JSON.stringify(value);
		return this.setItem(key, jsonString, inSession);
	},

	remove(key, inSession) {
		store(inSession).removeItem(key);
		if (inSession === 'both') {
			localStorage.removeItem(key);
		}
	}

}

function store(session) {
	return session ? sessionStorage : localStorage;
}