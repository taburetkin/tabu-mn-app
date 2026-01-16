import { ButtonView } from '../../../ButtonView';
import { View } from '../../../vendors.js';

const FooterButton = ButtonView.extend({

});

const Side = View.extend({
	childView: FooterButton
});

const LeftSide = Side.extend({
	name: 'leftSideView'
});
const RightSide = Side.extend({
	name: 'rightSideView'
});

export const FormFooterView = View.extend({
	tagName: 'footer',
	children: [
		LeftSide,
		RightSide
	],
	leftSideViewOptions() {
		return this._sideViewOptions('left');
	},
	rightSideViewOptions() {
		return this._sideViewOptions('right');
	},
	_sideViewOptions(side) {
		const buttons = this.getOption(side + 'Buttons');
		return {
			buttons
		}
	}
});