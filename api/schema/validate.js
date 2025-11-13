export function normalizeValidateResult(result) {
	if (result != null && 'ok' in result) {
		return result;
	}

	if (Array.isArray(result) && result.length === 0) {
		result = undefined;
	}

	const ok = result == null;

	return {
		ok,
		value: result
	}
}