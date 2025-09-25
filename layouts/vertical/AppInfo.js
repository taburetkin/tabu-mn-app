import { L } from '../../api/localize/index.js';
import { View } from '../../vendors.js';
export const AppInfo = View.extend({
	template: '<%= version.label %>: <%= version.value %>',
	templateContext() {
		return {
			version: {
				label: L('app.version'),
				value: '0.0.9',
			},
		}
	}
});