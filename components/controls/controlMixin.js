import { schemaApiViewMixin } from '../../api/schema/schemaApiViewMixin.js';
import { setValueMixin } from "./setValueMixin.js";

export const controlMixin = {
	...schemaApiViewMixin,
	...setValueMixin,
	parentShouldTriggerSetup: true,
	initializeControl() {
		this.initializeSchemaData();		
		this.editConfig = this.getOption('editConfig', true) || {};
		const { initialValidate } = this.editConfig;
		if (initialValidate) {
			this.on('setup', this.initialValidateAsync);
		}
	}
}