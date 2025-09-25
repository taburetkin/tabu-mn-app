import { normalizeIconArgument } from "./utils";

const faEngine = {
	getHtml(arg, type) {
		arg = normalizeIconArgument(arg);
		let add = '';
		if (arg.third) {
			add += ' ' + arg.third;
		}
		return `<span class="icon fnt ${type} fa-${arg.iconId}${add}"></span>`;
	}
}

export const engines = {
	'': {
		getHtml(arg) {
			return `<span class="icon fnt ${arg.iconId}"></span>`;
		}
	},
	bi: {
		getHtml(arg) {
			arg = normalizeIconArgument(arg);
			return `<span class="icon fnt bi bi-${arg.iconId}"></span>`;
		}
	},
	fa: {
		getHtml(arg) {
			return faEngine.getHtml(arg, 'fa');
		}
	},
	far: {
		getHtml(arg) {
			return faEngine.getHtml(arg, 'far');
		}
	},
	fab: {
		getHtml(arg) {
			return faEngine.getHtml(arg, 'fab');
		}
	},	
	svgInline: {
		getHtml(arg) {
			return `<span class="icon svg-container">${arg.svg}</span>`;
		},		

	},
	svgsprite: {
		getHtml(arg) {
			return `<span class="icon svg-container"><svg><use xlink:href="/assets/icon-sprite.svg#${arg.iconId}"></use></svg></span>`;
		}
	},
	svg: {
		getHtml(arg) {
			return `<span class="icon svg-container"><svg viewBox="${arg.svg.viewBox}"><use xlink:href="${arg.svg.toString()}" /></svg></span>`;
		},		
	},
	svgurl: {
		getHtml(arg) {
			return `<span class="icon svg-container"><img src="${arg.url.toString()}"></span>`;
		}
	}
}