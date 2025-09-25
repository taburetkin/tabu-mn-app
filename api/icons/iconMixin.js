import { iconsApi } from "./api";

export const iconMixin = {

	getIconHtml(suffix) {
		const iconValue = this.getIcon(suffix);
		if (iconValue === true) {
			return '<i></i>';
		}
		const iconHtml = iconsApi.getHtml(iconValue);
		return iconHtml || '';
	},

	getIcon(suffix = '') {
		let icon = this.getOption('icon' + suffix, true);
		return icon;
	},



}