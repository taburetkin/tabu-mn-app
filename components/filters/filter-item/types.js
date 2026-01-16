export const typesHash = {
	'string': {
		defaultOperator: 'like'
	},
	'number': {
		defaultValueModel: 'range',
		defaultOperator: '=',
		isNumeric: true,
	},
	'date': {
		defaultValueModel: 'range',
		defaultOperator: '=',
		isNumeric: true,
	},
	'time': {
		defaultValueModel: 'range',
		defaultOperator: '=',
		isNumeric: true,
	},
	'datetime': {
		defaultValueModel: 'range',
		defaultOperator: '=',
		isNumeric: true,
	},
	'enum': {
		defaultOperator: '='
	},
	'guid': {
		defaultOperator: '='
	}

}

export const types = Object.keys(typesHash);

types.forEach(id => {
	const type = typesHash[id];
	type.operators = [];
});

export function getTypeDefaultOperator(type) {
	const typeObj = typesHash[type];
	const defop = typeObj?.defaultOperator;
	console.error(type, typeObj, defop)
	return defop;
}

export function isNumeric(type) {
	const typeobj = typesHash[type];
	const num = !!typeobj?.isNumeric;
	return num;
}