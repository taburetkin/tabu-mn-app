import { Model, Collection } from '../../../vendors.js'
import { types, typesHash } from './types.js';

const OperatorModel = Model.extend({

})

const OperatorsCollection = Collection.extend({
	model: OperatorModel
});


// all
const equal = {
	'=':{},
	'!=':{},
}

// all numeric
const compare = {
	'>':{},
	'>=':{},
	'<':{},
	'<=':{}
}
// all numeric
const range = {
	'><': {},
	'><=': {},
	'>=<': {},
	'>=<=': {}
}

// string - specific, dbvalue: string, filterValue: string => string[], filterValue.any(word => dbvalue.contains(word)) 
// flags enum - specific, dbvalue: enum, filterValue: enum, dbvalue & filterValue > 0
// other: filterValue.indexOf(dbvalue) > -1
const contains = {
	'any': {

	}, //true when
	// string - any word - like
	// multiple enum - any flag
	// other: any value of array - must be simplified
	'all': {}, //true when
	// string - all words
	// multiple enum - all flags
	// other: not available > -1
	'!any': {},
	// string - missing any word
	// m enum - missing any flag
	// other - not equal any value of array - simplified
	'!all': {},
	// string - missing all words
	// m enum - missing all flags
	// other - not equal all values - simplified

}

//string only
const str = {
	'like':{ labelShort:"содержит"}, // %%
	'!like':{}, // !%%
	'starts':{}, // ?%
	'!starts':{}, // !?%
	'ends':{}, // %?
	'!ends':{}, // !%?
}

function process(obj, mapper, filter) {
	const ids = Object.keys(obj);
	for(let id of ids) {
		const model = obj[id];
		if(filter && !filter(model, id)) { continue; }
		mapper(model, id)
	}
}

const operators = {
	...equal,
	...compare,
	...range,
	...contains,
	...str
}

process(operators, (model, id) => Object.assign(model, { id: id, allowedFor: [], labelShort: model.labelShort || id }));
console.warn('operators', operators)
process(range, model => {
	
	Object.assign(model, { range: true });
	
	model.allowedFor.push('number','date', 'time', 'datetime');
	const chunks = model.id.split('<');
	chunks[0] = chunks[0] + ' A'
	chunks[1] = 'и <' + chunks[1] + ' B'
	model.label = chunks.join(' ');
});
process(compare, model => {
	model.allowedFor.push('number','date', 'time', 'datetime');
});
process(contains, model => {
	model.allowedFor.push('string', 'number', 'enum', 'guid');
	//('number','date', 'time', 'datetime');
});

process(str, model => {
	model.allowedFor.push('string');
	//('number','date', 'time', 'datetime');
});
const operatorsForType = {}
process(operators, model => {
	const allowedFor = model.allowedFor;
	
	for(let type of types) {
		if (!allowedFor.length || allowedFor.indexOf(type) >= 0) {
			const typeModel = typesHash[type];
			typeModel.operators.push(model.id)
		}
	}

});
const rawmodels = [];
process(operators, model => rawmodels.push(model));

export const operatorsCollection = new OperatorsCollection(rawmodels);
console.warn('operators', operatorsCollection);
console.warn('type operators', typesHash);