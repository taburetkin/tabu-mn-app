import { Model } from '../vendors.js';

const ActorClaims = Model.extend({

	getClaims() {
		const claims = Object.assign({}, this.attributes);
		return claims;
	},

	setClaims(attr) {
		this.clear({ silent: true });
		this.set(attr);
	}

});

export const actorClaims = new ActorClaims();



