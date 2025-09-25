export const localize = {
	warnOnPhraseMissing: true,
	locale: {
		phrases: {}
	},
	set(locale) {
		this.locale = locale;
	}
}

const fallback = {};

export function L(phrase) {
	const s = localize.locale?.phrases || fallback;
	if (phrase in s) {
		return s[phrase];
	} else {
		if (localize.warnOnPhraseMissing) {
			console.warn('phrase missing: `' + phrase + '`');
		} 
		return phrase;
	}
}

export function fnL(phrase) {
	return () => L(phrase);
}