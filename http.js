import { asyncCall, errResult, okResult } from "./async";

export const http = {

	async sendRequest(options) {
		console.warn('sendRequest', options);

		let { url, parseResponse = 'json', method, headers, mode, noCors } = options;
		if (!mode && !noCors) {
			mode = 'cors';
		}
		const sendOptions = {
			method, headers, mode
		}
		try {
			const response = await fetch(url, sendOptions);
			if (!response.ok) {
				return notOkResponse(response);
			}
			let result;
			if (parseResponse) {
				switch(parseResponse) {
					case 'json':
						result = await response.json();
						break;
					default: 
						throw new Error('unable to parse response - unhandled case: ' + parseResponse)
				}
			} else {
				result = await response.text();
			}
			return okResult(result);
		} catch (error) {
			return errResult(error);
		}		

		// override this method with custom send request implementation (f.e. jquery.ajax())
	},
	
	
	async sendAsync(options) {
		ensureOptions(options);
		const { success, fail, always } = options;
		const res = await asyncCall(() => this.sendRequest(options));
		if (res.ok && typeof success === 'function') {
			success(res.value);
		}
		else if (!res.ok && typeof fail === 'function') {
			fail(res.value);
		}

		if (typeof always === 'function') {
			always(res.value);
		}

		return res;
	},

}

function ensureOptions(options) {
	if (!options || (options && typeof options !== 'object')) {
		throw new Error('all async methods expect options object as argument or argumentless call')
	}
	const { url } = options;
	if (!url) {
		throw new Error('url missing')
	}
}

function notOkResponse(resp) {
	console.error(resp);
	const { status, statusText } = resp;
	const error = {
		status, 
		message: statusText
	}
	return errResult(error);
}