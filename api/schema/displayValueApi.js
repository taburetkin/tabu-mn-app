export const displayValueApi = {

	display(value, valueType, valueSubType, options = {}) {
		const { prefix, postfix }	= options;
		const res = this._tryTransform(value, valueType, valueSubType, options);
		if(res.ok) { return mixedRes.value; }
		const { emptyText = '' } = options;
		const text = value != null ? value.toString() : emptyText;
		const html = wrap(text, prefix, postfix);
		return html;
	},
	typesSubTypes: {

	},
	_getDisplayer(key) {
		if (this.typesSubTypes[key]) {
			return {
				ok: 1,
				value: this.typesSubTypes[key]
			}
		}

		return {
			ok: 0
		}

	},
	_tryTransform(value, valueType, valueSubType, options) {
		valueType = valueType || '';
		valueSubType = valueSubType || '';
		const key = valueType + ':' + valueSubType;
		let displayer;
		let res = this._getDisplayer(valueType + ':' + valueSubType);
		if(!res.ok) {
			res = this._getDisplayer(valueType);
		}
		if (!res.ok) {
			res = this._getDisplayer(valueSubType);
		}
		if (!res.ok) {
			return {
				ok: 0
			}
		}
		const text = res.value(value, valueType, valueSubType, options);
		return {
			ok: 1,
			value: text
		}
	},
	
}

function wrap(valueString, prefix, postfix) {
	const prefixHtml = wrapper(prefix, "value-prefix");
	const postfixHtml = wrapper(postfix, "value-postfix");
	const valueHtml = wrapper(valueString, "value");
	const res = prefixHtml + valueHtml + postfixHtml;
	return res;
}

const wrapper = (text = '', cssClass) => `<span${classWrapper(cssClass)}>${text}</span>`
const classWrapper = cssClass => cssClass != null && cssClass !== '' ? ` class="${cssClass}"` : '';