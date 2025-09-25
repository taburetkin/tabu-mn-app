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


export async function asyncCall(arg, ...args) {
	if (typeof arg === 'function') {
		arg = arg(...args);
	}
	
	if (arg instanceof Promise === false) {
		return normalizeAsyncResult(arg);
	}
	
	try {
		
		const res = await arg;
		return normalizeAsyncResult(res);
	
	} catch(exc) {

		return normalizeAsyncResult(exc, false)

	}
}

export const asyncMixin = {
	triggerMethodAsync() {
		return this.asyncResult(() => this.triggerMethod.apply(this, arguments))

	},
	asyncResult(arg) {
		return asyncCall(arg);
	}
}