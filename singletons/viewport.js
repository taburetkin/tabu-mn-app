import { Model, debounce } from '../vendors.js';


const Viewport = Model.extend({
	sizes: {
		mobile: { min: 0, max: 768 },
		tablet: { min: 769, max: 1199 },
		desktop: { min: 1200, max: Infinity }
	},

	
	start() {
		this.update();
		const handlerDelay = this.get('window.handler.delay') || 150;
		this._resizehandler = debounce(this.update.bind(this), handlerDelay);
		window.addEventListener('resize', this._resizehandler);
	},

	stop() {
		window.removeEventListener('resize', this._resizehandler);
		delete this._resizehandler;
	},

	update() {
		const height = window.innerHeight;
		const width = window.innerWidth;
		const aspect = width / height;
		const orientation = aspect >= 1 ? 'landscape' : 'portrait';
		let device;
		for(let sizeName in this.sizes) {
			const size = this.sizes[sizeName];
			if (width >= size.min && width <= size.max) {
				device = sizeName;
				break;
			}
		}
		this.set({ aspect, orientation, device });
	},

	get(arg) {
		if (arg && Array.isArray(arg)) {
			return arg.reduce((memo, key) => {
				const value = this.get(key)
				memo[key] = value;
				return memo;
			}, {});
		} else {
			return Model.prototype.get.apply(this, arguments);
		}
	}

});

export const viewport = new Viewport();