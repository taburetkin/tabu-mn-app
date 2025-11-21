import { asyncCall, errResult, okResult } from "./async";
import { invokeValue } from "./vendors.js";

export const http = {

	async sendRequest(options) {
		console.warn('send request', options);

		let { url, parseResponse = 'json', method, headers, mode, noCors, body } = options;
		if (!mode && !noCors) {
			mode = 'cors';
		}

		const sendOptions = {
			method, headers, mode, body
		}

		try {
			const response = await fetch(url, sendOptions);
			
			if (!response.ok) {
				return await notOkResponse(response);
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
		const { onSuccess, onFail, beforeRequest, afterRequest, args } = options;

		const callOptions = {
			onSuccess, onFail,
			beforeAction: beforeRequest,
			afterAction: afterRequest,
			args
		}

		//invokeValueEnsure(beforeRequest, null, options);

		const res = await asyncCall(() => this.sendRequest(options), callOptions);

		// if (res.ok) {
		// 	invokeValueEnsure(onSuccess, null, res.value);
		// }
		// else {
		// 	invokeValueEnsure(onFail, null, res.value);
		// }

		// invokeValueEnsure(afterRequest, null, res.value);

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

async function notOkResponse(response) {

	console.error('notOkRes', response);

	const json = await response.json();
	if (json) { return errResult(json); }

	const { status, statusText  } = resp;
	const error = {
		status, 
		message: statusText
	}
	return errResult(error);
}

// function invokeValueEnsure(callback, context, args) {
// 	try {
// 		invokeValue(callback, context, args);
// 	} catch (err) {
// 		console.error(err);
// 	}
// }