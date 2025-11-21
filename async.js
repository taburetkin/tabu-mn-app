import { addPreloaderToAsyncCallOptions } from "./api/preloader/index.js";
import { invokeValue } from "./vendors.js";

function _result(ok, value) {
	if (isAsyncResult(value)) {
		value = value.value;
	}
	return {
		ok, 
		value
	}
}

export function errResult(arg) {
	return _result(false, arg);
}

export function okResult(arg) {
	return _result(true, arg);
}

export function isAsyncResult(arg) {
	const isAsync = arg != null && typeof arg === 'object' && typeof arg.ok === 'boolean';
	return isAsync;
}

function normalizeAsyncResult(arg, okValue) {
	if (typeof okValue === 'boolean') {
		return _result(okValue, arg);
	}
	if (isAsyncResult(arg)) {
		return arg;
	}
	return okResult(arg);
}


export async function asyncCall(arg, options = {}) {
	if (options.preloader) {
		options = addPreloaderToAsyncCallOptions(options, options.preloader);
	}
	const { args = [], beforeAction, afterAction, onSuccess, onFail } = options;

	const beforeResult = invokeValueEnsure(beforeAction);
	if (!beforeResult.ok) return beforeResult;

	const argResult = invokeValueEnsure(arg, null, args);
	if (!argResult.ok) return argResult;

	
	let result;
	let resultCallback;
	try {
		
		const promiseResult = await argResult.value;
		result = normalizeAsyncResult(promiseResult);
		resultCallback = result.ok ? onSuccess : onFail;
	} catch(exc) {
		
		result = normalizeAsyncResult(exc, false);
		resultCallback = onFail;
	}
	invokeValueEnsure(afterAction, null, beforeResult.value);
	invokeValueEnsure(resultCallback, null, result.value);
	return result;
}

export const asyncMixin = {
	triggerMethodAsync() {
		return this.asyncResult(() => this.triggerMethod.apply(this, arguments))

	},
	asyncResult(arg, options) {
		return asyncCall(arg.bind(this), options);
	}
}



function invokeValueEnsure(callback, context, args) {
	try {
		const result = invokeValue(callback, context, args);
		return okResult(result);
	} catch (err) {
		console.error(err);
		return errResult(err);
	}
}