export const normalizedSymbol = Symbol('iconApiOptionsNormalized');

export function normalizeIconArgument(arg) {
	if (arg && typeof arg === 'object') {
		if (arg[normalizedSymbol]) {
			return arg;
		}
		if (arg.viewBox) {
			arg = {
				engineId: 'svg',
				svg: arg,
				[normalizedSymbol]: 1
			}
			return arg;
		}
		if (arg instanceof URL) {
			arg = {
				engineId: 'svgurl',
				url: arg,
				[normalizedSymbol]: 1
			}
			return arg;
		}
	}

	if (typeof arg !== 'string') { 
		throw new Error((typeof arg) + ' icon normalizing not implemented') 
	}

	if (arg.startsWith('<svg')) {
		arg = {
			engineId: 'svgInline',
			svg: arg,
			[normalizedSymbol]: 1
		}
		return arg;
	}

	const chunks = arg.split(':');
	const normalized = {
		[normalizedSymbol]: 1
	};

	if (chunks.length > 1) {
		let [ engineId, iconId, third, fourth ] = chunks;
		Object.assign(normalized, { engineId, iconId, third, fourth });
	} else {
		Object.assign(normalized, { engineId: '', iconId: arg });
	}

	return normalized;
}
