import { entityBackendMixin } from './backend.js';
import { Model as _Model } from './vendors.js';

export const Model = _Model.extend({
	...entityBackendMixin
});