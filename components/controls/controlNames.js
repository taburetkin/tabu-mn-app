import { InlineCheckboxLabel } from "./InlineCheckboxLabel.js";
import { RangeInput } from "./RangeInput.js";
import { Select } from './select/index.js'
export const controlNames = new Map();

controlNames.set('inline-checkbox-label', InlineCheckboxLabel);
controlNames.set('range-input', RangeInput);
controlNames.set('select', Select);