import { InputView } from "./Input.js";
import { controlNames } from "./controlNames.js";
import { Select, SelectEnum } from './select/index.js';

export function detectControl(data = {}) {
	const { valueType, valueSubType, sourceValues, inlineControl, control, controlName, inline } = data;
	if (inline && inlineControl) {
		return inlineControl;
	}
	if (!inline && control) {
		return control;
	}

	if (controlName) {
		const ctrl = controlNames.get(controlName);
		if (ctrl) {
			return (!inline || !!ctrl.inline === !!inline) && ctrl;
		}
	}
	var select = tryGetSelectControl(data);
	if (select) {
		return (!inline || !!select.inline === !!inline) && select;
	}

	return InputView;
}

function tryGetSelectControl(data) {
	const { valueType, valueSubType, sourceValues, control, controlName } = data;
	if (valueType === 'enum') {
		return enumSelectControl(data);
	}
	else if (valueType === 'boolean') {
		return booleanSelectControl();
	}
}

function enumSelectControl(data) {
	return SelectEnum;
}

function booleanSelectControl(data) {

}