import { invokeValue, attachView } from "../../vendors.js";
import { PreloaderView } from "./PreloaderView.js";

export function createPreloader(options = {}) {
	let { message = "Подождите, действие выполняется.", view, viewOptions } = options;
	const preloader = {
		show() {
			if (!view) {
				const options = Object.assign({ message }, viewOptions);
				view = new PreloaderView(options)
			}
			this.view = view;
			attachView(view, { el: document.body });
			console.log('preloader view', view);
		},
		destroy() {
			this.view.destroy();
		}
	}
	return preloader;
}

export function addPreloaderToAsyncCallOptions(callOptions, preloaderOptions) {
	if (preloaderOptions == null) return callOptions;

	if (typeof preloaderOptions === 'string') {
		preloaderOptions = { message: preloaderOptions }
	}

	if (typeof preloaderOptions !== 'object') return callOptions;


	const preloader = createPreloader(preloaderOptions);
	const beforeAction = () => preloader.show();
	const afterAction = () => preloader.destroy();
	callOptions = Object.assign({}, callOptions);
	wrapMethod(callOptions, 'beforeAction', beforeAction);
	wrapMethod(callOptions, 'afterAction', afterAction);
	return callOptions;
}

function wrapMethod(obj, methodName, wrapWith) {
	const unwraped = obj[methodName];
	obj[methodName] = function() {
		wrapWith.apply(null, arguments);
		return invokeValue(unwraped, null, arguments);
	}
}