import { entityBackendMixin } from './backend.js';
import { Collection as _Collection } from './vendors.js';

export const Collection = _Collection.extend({
	...entityBackendMixin
});