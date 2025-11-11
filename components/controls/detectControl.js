import { InputView } from "./Input.js";
import { controlNames } from "./controlNames.js";


export function detectControl({ valueType, valueSubType, sourceValues, controlName } = {}) {
	if (controlName) {
		return controlNames.get(controlName);
	}

	return InputView;
}