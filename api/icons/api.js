import { normalizeIconArgument } from "./utils";
import { engines } from "./engines";

export const iconsApi = {

	getEngine(arg) {
		arg = normalizeIconArgument(arg);
		return engines[arg?.engineId];
	},

	getHtml(arg) {
		if (arg == null || arg === '') { return ''; }
		arg = normalizeIconArgument(arg);
		const engine = this.getEngine(arg);
		return engine?.getHtml(arg) || '';
	}

}