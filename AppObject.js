import { MnObject } from './vendors.js';
import { asyncMixin } from './async.js';

export const AppObject = MnObject.extend({
	...asyncMixin,
});
