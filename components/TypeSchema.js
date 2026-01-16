import { Model, Collection } from "../vendors";

const TypeSchema = Model.extend({

});

const TypesCollection = Collection.extend({
	model: TypeSchema,

}); 
 
const Schema = Model.extend({
	initialize() {
		this.types = new TypesCollection();
	},
	setTypes(types) {
		const models = Object.keys(types).map(id => Object.assign({ id }, types[id]));
		this.types.add(models);
	}
}, {
	create(types) {
		const schema = new Schema();
		schema.setTypes(types);
		return schema;
	}
});