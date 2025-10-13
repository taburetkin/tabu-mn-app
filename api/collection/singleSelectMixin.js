const selectedKey = Symbol('selected');
export const singleSelectMixin = {

	select(model) {
		const event = this.selectModelEvent || 'select';
		if (this[selectedKey]) {
			let selected = this[selectedKey];
			delete this[selectedKey];
			selected.trigger(event, selected, false);
		}
		if (model) {
			this[selectedKey] = model;
			model.trigger(event, model, true);
		}
	},

	isSelected(model) {
		return model === this[selectedKey];
	},

	selected() {
		return this[selectedKey];
	}

}