import { AppObject } from "../../AppObject.js";

export const Selector = AppObject.extend({
	initialize(options) {
		this.mergeOption(options, ['collection', 'multiple', 'children']);
	}
});